<script lang="ts">
  import { goto } from '$app/navigation';
  import { isAuthenticated, user } from '$lib/stores/auth';

  function handleSignOut() {
    isAuthenticated.signOut();
    user.clear();
    goto('/');
  }
</script>

<nav class="bg-gray-800 py-4">
  <div class="container mx-auto px-4 flex justify-between items-center">
    <a href="/" class="text-2xl font-bold text-white">CarListKaro</a>
    <div class="space-x-4">
      {#if $isAuthenticated}
        <a 
          href="/dashboard" 
          class="text-gray-300 hover:text-white transition"
        >
          Dashboard
        </a>
        <button
          on:click={handleSignOut}
          class="text-gray-300 hover:text-white transition"
        >
          Sign Out
        </button>
      {:else}
        <a 
          href="/login" 
          class="text-gray-300 hover:text-white transition"
        >
          Login
        </a>
        <a 
          href="/register" 
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </a>
      {/if}
    </div>
  </div>
</nav> 