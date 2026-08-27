import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="brand">
        <span class="icon">🐛</span>
        <span class="title">Angular Error Lab</span>
      </div>
      <ul class="nav-links">
        <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a></li>
        <li><a routerLink="/error-lab" routerLinkActive="active">Error Lab</a></li>
        <li><a routerLink="/performance" routerLinkActive="active">Performance Lab</a></li>
        <li><a routerLink="/users" routerLinkActive="active">Users</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 40px;
      background: rgba(30, 30, 36, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-color, #2a2a35);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .icon {
      font-size: 1.5rem;
    }
    .title {
      font-weight: 800;
      font-size: 1.2rem;
      color: var(--text-primary, #dcdfe4);
      letter-spacing: 0.5px;
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 30px;
      margin: 0;
      padding: 0;
    }
    .nav-links a {
      color: var(--text-secondary, #abb2bf);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.2s, text-shadow 0.2s;
    }
    .nav-links a:hover {
      color: var(--primary-color, #61afef);
    }
    .nav-links a.active {
      color: var(--primary-color, #61afef);
      text-shadow: 0 0 10px rgba(97, 175, 239, 0.5);
    }
  `]
})
export class NavbarComponent {}
