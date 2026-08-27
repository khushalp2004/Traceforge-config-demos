import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-issue-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="issue-card">
      <div class="issue-header">
        <h3>{{ issueName }}</h3>
      </div>
      <div class="issue-body">
        <p class="description"><strong>Description:</strong> {{ description }}</p>
        <p class="expected"><strong>Expected Error:</strong> <code>{{ expectedError }}</code></p>
        <p class="cause"><strong>Root Cause:</strong> {{ rootCause }}</p>
        <p class="fix"><strong>Suggested Fix:</strong> {{ suggestedFix }}</p>
      </div>
      <div class="issue-footer">
        <button class="btn btn-trigger" (click)="onTrigger()">Trigger Issue</button>
      </div>
    </div>
  `,
  styles: [`
    .issue-card {
      background: var(--surface-color, #1e1e24);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      border: 1px solid var(--border-color, #2a2a35);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .issue-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    }
    .issue-header h3 {
      margin: 0;
      color: var(--primary-color, #e06c75);
      font-size: 1.2rem;
    }
    .issue-body p {
      margin: 8px 0;
      font-size: 0.95rem;
      line-height: 1.4;
      color: var(--text-secondary, #abb2bf);
    }
    .issue-body strong {
      color: var(--text-primary, #dcdfe4);
    }
    .issue-body code {
      background: var(--bg-code, #282c34);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: #e5c07b;
    }
    .btn-trigger {
      background: var(--danger-color, #e06c75);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.2s;
      width: 100%;
    }
    .btn-trigger:hover {
      background: var(--danger-hover, #be5058);
    }
  `]
})
export class IssueCardComponent {
  @Input() issueName!: string;
  @Input() description!: string;
  @Input() expectedError!: string;
  @Input() rootCause!: string;
  @Input() suggestedFix!: string;
  
  @Output() trigger = new EventEmitter<void>();

  onTrigger() {
    this.trigger.emit();
  }
}
