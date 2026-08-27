import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { LoggerService } from '../../core/services/logger.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <header class="users-header">
        <h1>Users</h1>
        <p>Demonstrating Route Params, HTTP calls, and Store state.</p>
      </header>

      <div class="actions">
        <button class="btn btn-primary" (click)="loadUsers()">Load Users</button>
        <button class="btn" (click)="resetStore()">Reset State</button>
      </div>

      <!-- State: Loading -->
      <div *ngIf="store.loading()" class="state loading">
        Loading users...
      </div>

      <!-- State: Error -->
      <div *ngIf="store.error()" class="state error">
        {{ store.error() }}
      </div>

      <!-- State: Success -->
      <div *ngIf="!store.loading() && !store.error() && store.users().length > 0" class="users-grid">
        <div class="user-card" *ngFor="let user of store.users()">
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
          <div class="user-id">ID: {{ user.id }}</div>
        </div>
      </div>
      
      <!-- Resolved Route Data -->
      <div *ngIf="resolvedUserId" class="resolved-data">
        <h3>Resolved Route Param:</h3>
        <p>Looking up User ID: <strong>{{ resolvedUserId }}</strong></p>
        <div *ngIf="resolvedUserId === 'invalid-id'" class="error-msg">
          Error: User not found! (Simulated error for id 'invalid-id')
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .users-header h1 { color: #c678dd; font-size: 2.5rem; margin-bottom: 10px; }
    .users-header p { color: var(--text-secondary); margin-bottom: 30px; }
    .actions { display: flex; gap: 15px; margin-bottom: 30px; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; background: #3e4451; color: white; transition: background 0.2s;}
    .btn:hover { background: #4b5363; }
    .btn-primary { background: #c678dd; color: #1e1e24; }
    .btn-primary:hover { background: #a862bd; }
    .state { padding: 20px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; }
    .loading { background: rgba(97, 175, 239, 0.2); color: #61afef; border: 1px solid rgba(97, 175, 239, 0.5); }
    .error { background: rgba(224, 108, 117, 0.2); color: #e06c75; border: 1px solid rgba(224, 108, 117, 0.5); }
    .users-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .user-card { background: rgba(30, 30, 36, 0.6); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); }
    .user-card h3 { margin-top: 0; color: var(--text-primary); }
    .user-card p { color: var(--text-secondary); }
    .user-id { font-family: monospace; color: #5c6370; font-size: 0.85rem; margin-top: 15px; }
    .resolved-data { margin-top: 40px; padding: 20px; background: rgba(0,0,0,0.2); border-left: 4px solid #c678dd; }
    .error-msg { color: #e06c75; font-weight: bold; margin-top: 10px; }
  `]
})
export class UsersComponent implements OnInit {
  store = inject(StoreService);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);

  resolvedUserId: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.resolvedUserId = id;
        this.logger.info(`Resolved user route with ID: ${id}`);
        if (id === 'invalid-id') {
          this.logger.error('Route parameter error: User not found!');
        }
      }
    });
  }

  loadUsers() {
    this.store.loadUsers();
  }

  resetStore() {
    this.store.reset();
  }
}
