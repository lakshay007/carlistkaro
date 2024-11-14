import { writable } from 'svelte/store';

function createAuthStore() {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    set: (value: boolean) => {
      set(value);
    },
    check: () => {
      const token = localStorage.getItem('token');
      set(!!token);
    },
    signOut: () => {
      localStorage.removeItem('token');
      set(false);
    }
  };
}

function createUserStore() {
  const { subscribe, set } = writable(null);

  return {
    subscribe,
    set: (value: any) => {
      set(value);
    },
    clear: () => {
      set(null);
    }
  };
}

export const isAuthenticated = createAuthStore();
export const user = createUserStore(); 