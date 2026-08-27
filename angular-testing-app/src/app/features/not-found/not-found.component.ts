import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The routing you requested doesn't exist.</p>
      <a routerLink="/" class="btn-home">Return to Dashboard</a>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60vh;
      text-align: center;
    }
    h1 {
      font-size: 8rem;
      margin: 0;
      color: var(--danger-color, #e06c75);
      line-height: 1;
    }
    h2 {
      font-size: 2rem;
      color: var(--text-primary);
      margin: 10px 0;
    }
    p {
      color: var(--text-secondary);
      margin-bottom: 30px;
    }
    .btn-home {
      padding: 12px 24px;
      background: var(--primary-color, #61afef);
      color: #1e1e24;
      text-decoration: none;
      font-weight: bold;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .btn-home:hover {
      background: #4b8cc7;
    }
  `]
})
export class NotFoundComponent {}
