import { Injectable, signal } from '@angular/core';
import { LoggerService } from './logger.service';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Using Signals for state
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private logger: LoggerService) {
    // Check if user exists in local storage for a simple persistent session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
      this.isAuthenticated.set(true);
      this.logger.info('User restored from session', this.currentUser());
    }
  }

  login() {
    const user: User = { id: 'user-123', name: 'Dev User', email: 'dev@example.com' };
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('user', JSON.stringify(user));
    this.logger.info('User logged in', user);
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('user');
    this.logger.info('User logged out');
  }
}
