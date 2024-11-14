<script lang="ts">
  import { auth } from '$lib/api';
  import { goto } from '$app/navigation';
  import { isAuthenticated, user } from '$lib/stores/auth';

  let email = '';
  let password = '';
  let error = '';

  async function handleLogin() {
    try {
      const response = await auth.login(email, password);
      localStorage.setItem('token', response.data.token);
      isAuthenticated.set(true);
      user.set(response.data.user);
      goto('/dashboard');
    } catch (err) {
      error = 'Invalid credentials';
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6">Login</h2>
    
    {#if error}
      <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="mb-4">
        <label class="block mb-2">Email</label>
        <input
          type="email"
          bind:value={email}
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2">Password</label>
        <input
          type="password"
          bind:value={password}
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>

    <p class="mt-4 text-center">
      Don't have an account? <a href="/register" class="text-blue-500">Register</a>
    </p>
  </div>
</div> 