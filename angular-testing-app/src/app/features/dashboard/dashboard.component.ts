import { Component, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <p>System Overview & Status</p>
      </header>
      
      <div class="status-grid">
        <div class="status-card">
          <div class="icon">🚀</div>
          <div class="details">
            <span class="label">Angular Version</span>
            <span class="value">{{ angularVersion }}</span>
          </div>
        </div>

        <div class="status-card">
          <div class="icon">🌍</div>
          <div class="details">
            <span class="label">Environment</span>
            <span class="value">{{ envName }}</span>
          </div>
        </div>

        <div class="status-card">
          <div class="icon">⚙️</div>
          <div class="details">
            <span class="label">Build Mode</span>
            <span class="value">{{ isProd ? 'Production' : 'Development' }}</span>
          </div>
        </div>

        <div class="status-card" [class.success]="apiStatus === 'Online'">
          <div class="icon">📡</div>
          <div class="details">
            <span class="label">API Status</span>
            <span class="value">{{ apiStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .dashboard-header {
      margin-bottom: 40px;
      text-align: center;
    }
    .dashboard-header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      color: var(--primary-color, #61afef);
    }
    .dashboard-header p {
      font-size: 1.1rem;
      color: var(--text-secondary, #abb2bf);
    }
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    .status-card {
      background: rgba(30, 30, 36, 0.6);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      padding: 25px;
      display: flex;
      align-items: center;
      gap: 20px;
      backdrop-filter: blur(5px);
      transition: transform 0.3s ease;
    }
    .status-card:hover {
      transform: translateY(-5px);
    }
    .icon {
      font-size: 2.5rem;
      background: rgba(255, 255, 255, 0.05);
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    .details {
      display: flex;
      flex-direction: column;
    }
    .label {
      font-size: 0.9rem;
      color: var(--text-secondary, #abb2bf);
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .value {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-primary, #dcdfe4);
    }
    .success .value {
      color: #98c379;
    }
  `]
})
export class DashboardComponent {
  angularVersion = VERSION.full;
  envName = environment.production ? 'Production' : 'Development';
  isProd = environment.production;
  apiStatus = 'Online'; // Simulated for now
}
