import { Component, OnDestroy, OnInit, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { interval, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoggerService } from '../../core/services/logger.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="perf-container">
      <header class="perf-header">
        <h1>Performance Lab</h1>
        <p>Investigate memory leaks and rendering bottlenecks.</p>
      </header>

      <div class="perf-sections">
        
        <!-- Section: Memory Leaks -->
        <section class="perf-card">
          <h2>RxJS Memory Leak</h2>
          <p>Start a timer interval. If you navigate away without using the "Fixed" version, the interval continues running in the background.</p>
          <div class="actions">
            <button class="btn btn-bad" (click)="startLeakyInterval()">Start Leaky Interval</button>
            <button class="btn btn-good" (click)="startSafeInterval()">Start Safe Interval (takeUntilDestroyed)</button>
          </div>
          <div class="demo-output" *ngIf="leakyCount() > 0 || safeCount() > 0">
            Leaky Count: {{ leakyCount() }} | Safe Count: {{ safeCount() }}
          </div>
        </section>

        <!-- Section: Event Listener Leak -->
        <section class="perf-card">
          <h2>DOM Event Listener Leak</h2>
          <p>Bind an event listener to the window object.</p>
          <div class="actions">
            <button class="btn btn-bad" (click)="addLeakyListener()">Add Leaky Window Listener</button>
            <button class="btn btn-good" (click)="addSafeListener()">Add Safe Window Listener</button>
          </div>
          <div class="demo-output">Open console to see scroll events.</div>
        </section>

        <!-- Section: Expensive Template Calculation -->
        <section class="perf-card">
          <h2>Expensive Template Calculation</h2>
          <p>Calling a heavy function directly in the template triggers on every change detection cycle.</p>
          <div class="actions">
            <button class="btn" (click)="triggerChangeDetection()">Trigger Change Detection</button>
          </div>
          <div class="demo-output">
            <p><strong>Bad:</strong> {{ calculateExpensiveValue() }}</p>
            <p><strong>Good (Signal/Memoized):</strong> {{ memoizedExpensiveValue() }}</p>
          </div>
        </section>

        <!-- Section: Large List Rendering -->
        <section class="perf-card">
          <h2>Large List Rendering & trackBy</h2>
          <p>Render 10,000 items. Toggle data mutation to observe layout trashing without trackBy.</p>
          <div class="actions">
            <button class="btn" (click)="generateLargeList()">Generate 10k Items</button>
            <button class="btn btn-bad" (click)="mutateListWithoutTrackBy()">Mutate (No trackBy)</button>
            <button class="btn btn-good" (click)="mutateListWithTrackBy()">Mutate (With trackBy)</button>
          </div>
          
          <div class="list-container" *ngIf="largeList.length > 0">
            <div class="list-col">
              <h3>Without trackBy</h3>
              <div class="list-scroll">
                <div class="list-item" *ngFor="let item of largeList">{{ item.name }}</div>
              </div>
            </div>
            <div class="list-col">
              <h3>With trackBy</h3>
              <div class="list-scroll">
                <div class="list-item" *ngFor="let item of largeList; trackBy: trackById">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .perf-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .perf-header { text-align: center; margin-bottom: 40px; }
    .perf-header h1 { font-size: 2.5rem; color: #e5c07b; margin-bottom: 10px; }
    .perf-header p { color: var(--text-secondary); font-size: 1.1rem; }
    
    .perf-sections { display: flex; flex-direction: column; gap: 30px; }
    .perf-card {
      background: rgba(30, 30, 36, 0.6);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 25px;
    }
    .perf-card h2 { color: var(--text-primary); margin-top: 0; }
    .perf-card p { color: var(--text-secondary); line-height: 1.5; }
    
    .actions { display: flex; gap: 15px; margin: 20px 0; flex-wrap: wrap; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; background: #3e4451; color: white; transition: background 0.2s;}
    .btn:hover { background: #4b5363; }
    .btn-bad { background: var(--danger-color, #e06c75); }
    .btn-bad:hover { background: #be5058; }
    .btn-good { background: #98c379; color: #1e1e24;}
    .btn-good:hover { background: #7ca85e; }
    
    .demo-output {
      margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; font-family: monospace;
    }
    
    .list-container { display: flex; gap: 20px; margin-top: 20px; }
    .list-col { flex: 1; }
    .list-scroll { height: 200px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 10px;}
    .list-item { padding: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem; color: #abb2bf;}
  `]
})
export class PerformanceComponent implements OnDestroy {
  leakyCount = signal(0);
  safeCount = signal(0);
  
  private leakySub?: Subscription;
  private safeSub?: Subscription;
  
  private leakyListener = () => { this.logger.debug('Window scroll event! (Leaky)'); };
  private safeListener = () => { this.logger.debug('Window scroll event! (Safe)'); };
  private isSafeListenerAdded = false;

  // Expensive calculate
  private baseValue = signal(1);
  memoizedExpensiveValue = computed(() => {
    // Simulated expensive calc that only runs when baseValue changes
    let result = 0;
    for(let i=0; i<1000000; i++) { result += i; }
    return result + this.baseValue();
  });

  // Large list
  largeList: any[] = [];

  constructor(private logger: LoggerService) {}

  startLeakyInterval() {
    this.logger.warn('Starting leaky interval. It will not be destroyed when leaving the page.');
    this.leakySub = interval(1000).subscribe(() => this.leakyCount.update(c => c + 1));
  }

  startSafeInterval() {
    // takeUntilDestroyed is tied to the current injection context
    this.logger.info('Starting safe interval.');
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.safeCount.update(c => c + 1));
  }

  addLeakyListener() {
    this.logger.warn('Adding leaky scroll listener.');
    window.addEventListener('scroll', this.leakyListener);
  }

  addSafeListener() {
    if (!this.isSafeListenerAdded) {
      this.logger.info('Adding safe scroll listener.');
      window.addEventListener('scroll', this.safeListener);
      this.isSafeListenerAdded = true;
    }
  }

  triggerChangeDetection() {
    this.baseValue.update(v => v + 1);
  }

  calculateExpensiveValue() {
    // Bad practice: Called continuously during change detection
    let result = 0;
    for(let i=0; i<1000000; i++) { result += i; }
    this.logger.debug('Expensive function called in template!');
    return result + this.baseValue();
  }

  generateLargeList() {
    this.logger.info('Generating 10,000 items');
    this.largeList = Array.from({ length: 10000 }).map((_, i) => ({ id: i, name: `Item ${i}` }));
  }

  mutateListWithoutTrackBy() {
    // Creating entirely new references forces DOM recreation
    this.largeList = this.largeList.map(item => ({ ...item, name: item.name + ' *' }));
  }

  mutateListWithTrackBy() {
    // Angular uses trackById to only update changed text nodes
    this.largeList = this.largeList.map(item => ({ ...item, name: item.name + ' *' }));
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    // Safe cleanup
    if (this.isSafeListenerAdded) {
      window.removeEventListener('scroll', this.safeListener);
    }
    // Intentionally NOT cleaning up leakySub or leakyListener to demonstrate the issue
    this.logger.info('PerformanceComponent destroyed. Did you leave leaks behind?');
  }
}
