<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/stores/auth';
  import { cars } from '$lib/api';
  import type { Car } from '$lib/types';
  import { page } from '$app/stores';

  let car: Car | null = null;
  let loading = true;
  let error = '';
  let currentImageIndex = 0;

  onMount(async () => {
    if (!$isAuthenticated) {
      goto('/login');
      return;
    }

    try {
      const response = await cars.get($page.params.id);
      car = response.data;
    } catch (err: any) {
      error = err.response?.data?.message || 'Failed to load car details';
    } finally {
      loading = false;
    }
  });

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      loading = true;
      await cars.delete($page.params.id);
      goto('/dashboard');
    } catch (err: any) {
      error = err.response?.data?.message || 'Failed to delete car';
      loading = false;
    }
  }

  function nextImage() {
    if (car && currentImageIndex < car.images.length - 1) {
      currentImageIndex++;
    }
  }

  function previousImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
    }
  }
</script>

<div class="container mx-auto p-4 max-w-4xl">
  <div class="mb-6">
    <a href="/dashboard" class="text-blue-500 hover:underline">← Back to Dashboard</a>
  </div>

  {#if loading}
    <div class="text-center py-8">Loading...</div>
  {:else if error}
    <div class="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
  {:else if car}
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Image Gallery -->
      <div class="relative">
        {#if car.images.length > 0}
          <img 
            src={car.images[currentImageIndex]} 
            alt={car.title}
            class="w-full h-96 object-cover"
          />
          {#if car.images.length > 1}
            <button 
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              on:click={previousImage}
              disabled={currentImageIndex === 0}
            >
              ←
            </button>
            <button 
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              on:click={nextImage}
              disabled={currentImageIndex === car.images.length - 1}
            >
              →
            </button>
          {/if}
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div class="flex gap-2">
              {#each car.images as _, index}
                <button 
                  class="w-2 h-2 rounded-full {index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}"
                  on:click={() => currentImageIndex = index}
                />
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Car Details -->
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h1 class="text-3xl font-bold">{car.title}</h1>
          <div class="flex gap-2">
            <a 
              href={`/cars/${car._id}/edit`}
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Edit
            </a>
            <button 
              on:click={handleDelete}
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>

        <p class="text-gray-600 mb-6">{car.description}</p>

        <div class="grid grid-cols-3 gap-4">
          {#if car.tags.car_type}
            <div class="border rounded p-3">
              <div class="text-sm text-gray-500">Car Type</div>
              <div class="font-semibold">{car.tags.car_type}</div>
            </div>
          {/if}
          {#if car.tags.company}
            <div class="border rounded p-3">
              <div class="text-sm text-gray-500">Company</div>
              <div class="font-semibold">{car.tags.company}</div>
            </div>
          {/if}
          {#if car.tags.dealer}
            <div class="border rounded p-3">
              <div class="text-sm text-gray-500">Dealer</div>
              <div class="font-semibold">{car.tags.dealer}</div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div> 