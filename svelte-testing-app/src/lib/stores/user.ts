import { writable } from 'svelte/store';

export interface User {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'user';
}

interface UserState {
	user: User | null;
	loading: boolean;
	error: string | null;
}

function createUserStore() {
	const { subscribe, set, update } = writable<UserState>({
		user: null,
		loading: false,
		error: null
	});

	return {
		subscribe,
		loadUser: async () => {
			update((s) => ({ ...s, loading: true, error: null }));
			try {
				// Simulating API call
				await new Promise((resolve) => setTimeout(resolve, 800));
				
				// Simulating successful login
				const mockUser: User = {
					id: '1',
					name: 'Test Engineer',
					email: 'tester@svelte.dev',
					role: 'admin'
				};
				update((s) => ({ ...s, user: mockUser, loading: false }));
			} catch (err) {
				update((s) => ({ 
					...s, 
					loading: false, 
					error: err instanceof Error ? err.message : 'Unknown error occurred'
				}));
			}
		},
		logout: () => set({ user: null, loading: false, error: null }),
		reset: () => set({ user: null, loading: false, error: null })
	};
}

export const userStore = createUserStore();
