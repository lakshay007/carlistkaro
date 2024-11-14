<script lang="ts">
  import { auth } from '$lib/api';
  import { goto } from '$app/navigation';
  import { isAuthenticated, user } from '$lib/stores/auth';

  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let loading = false;

  async function handleRegister() {
    try {
      if (password !== confirmPassword) {
        error = 'Passwords do not match';
        return;
      }

      loading = true;
      error = '';
      
      const response = await auth.register(name, email, password);
      console.log('Registration response:', response);
      
      localStorage.setItem('token', response.data.token);
      isAuthenticated.set(true);
      user.set(response.data.user);
      goto('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      error = err.response?.data?.message || 'Registration failed. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6">Register</h2>
    
    {#if error}
      <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleRegister}>
      <div class="mb-4">
        <label class="block mb-2">Name</label>
        <input
          type="text"
          bind:value={name}
          class="w-full p-2 border rounded"
          required
          disabled={loading}
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2">Email</label>
        <input
          type="email"
          bind:value={email}
          class="w-full p-2 border rounded"
          required
          disabled={loading}
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2">Password</label>
        <input
          type="password"
          bind:value={password}
          class="w-full p-2 border rounded"
          required
          minlength="6"
          disabled={loading}
        />
      </div>

      <div class="mb-6">
        <label class="block mb-2">Confirm Password</label>
        <input
          type="password"
          bind:value={confirmPassword}
          class="w-full p-2 border rounded"
          required
          minlength="6"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>

    <p class="mt-4 text-center">
      Already have an account? <a href="/login" class="text-blue-500">Login</a>
    </p>
  </div>
</div> 