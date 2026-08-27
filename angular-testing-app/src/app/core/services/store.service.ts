import { Injectable, signal, computed } from '@angular/core';
import { ApiService, User } from './api.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // State
  users = signal<User[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed
  userCount = computed(() => this.users().length);

  constructor(private api: ApiService, private logger: LoggerService) {}

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);
    this.logger.debug('Loading users from store');

    this.api.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
        this.logger.info('Users loaded successfully', data);
      },
      error: (err) => {
        this.error.set('Failed to load users');
        this.loading.set(false);
        this.logger.error('Error loading users in store', err);
      }
    });
  }

  reset() {
    this.users.set([]);
    this.loading.set(false);
    this.error.set(null);
    this.logger.debug('Store state reset');
  }
}
