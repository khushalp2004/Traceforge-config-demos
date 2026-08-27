import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { 
    path: 'error-lab', 
    loadComponent: () => import('./features/error-lab/error-lab.component').then(m => m.ErrorLabComponent)
  },
  { 
    path: 'performance', 
    loadComponent: () => import('./features/performance/performance.component').then(m => m.PerformanceComponent)
  },
  { 
    path: 'users', 
    loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
  },
  { 
    path: 'users/:id', 
    loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
  },
  // Simulate a protected route to show the guard
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) // Just load dashboard for demo
  },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
