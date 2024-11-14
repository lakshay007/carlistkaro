<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/stores/auth';
  import { cars } from '$lib/api';
  import type { Car } from '$lib/types';

  let searchQuery = '';
  let carsList: Car[] = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    if (!$isAuthenticated) {
      goto('/login');
      return;
    }
    
    try {
      const response = await cars.list();
      carsList = response.data;
    } catch (err) {
      error = 'Failed to load cars';
    } finally {
      loading = false;
    }
  });

  async function handleSearch() {
    try {
      loading = true;
      const response = await cars.list(searchQuery);
      carsList = response.data;
    } catch (err) {
      error = 'Search failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">My Cars</h1>
    <a 
      href="/cars/new" 
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
    >
      Add New Car
    </a>
  </div>

  <div class="mb-6">
    <div class="flex gap-2">
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder="Search cars..." 
        class="flex-1 p-2 border rounded"
        on:keyup={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button 
        class="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition"
        on:click={handleSearch}
      >
        Search
      </button>
    </div>
  </div>

  {#if loading}
    <div class="text-center py-8">Loading...</div>
  {:else if error}
    <div class="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
  {:else if carsList.length === 0}
    <div class="text-center py-8 text-gray-500">
      No cars found. Add your first car to get started!
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each carsList as car}
        <div class="border rounded-lg overflow-hidden hover:shadow-lg transition">
          {#if car.images && car.images[0]}
            <img 
              src={car.images[0]} 
              alt={car.title} 
              class="w-full h-48 object-cover"
            />
          {:else}
            <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
              No Image
            </div>
          {/if}
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">{car.title}</h3>
            <p class="text-gray-600 text-sm mb-2">{car.description}</p>
            <div class="flex gap-2">
              {#each Object.entries(car.tags) as [key, value]}
                {#if value}
                  <span class="text-xs bg-gray-100 px-2 py-1 rounded">
                    {value}
                  </span>
                {/if}
              {/each}
            </div>
            <div class="mt-4 flex gap-2">
              <a 
                href={`/cars/${car._id}`}
                class="text-blue-500 hover:underline"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 