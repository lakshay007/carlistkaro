<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/stores/auth';
  import { cars } from '$lib/api';
  import type { Car } from '$lib/types';
  import { page } from '$app/stores';

  let car: Car | null = null;
  let title = '';
  let description = '';
  let carType = '';
  let company = '';
  let dealer = '';
  let images: FileList | null = null;
  let keepImages: string[] = [];
  let error = '';
  let loading = true;

  onMount(async () => {
    if (!$isAuthenticated) {
      goto('/login');
      return;
    }

    try {
      const response = await cars.get($page.params.id);
      car = response.data;
      
      // Pre-fill the form
      title = car.title;
      description = car.description;
      carType = car.tags.car_type;
      company = car.tags.company;
      dealer = car.tags.dealer;
      keepImages = car.images;
    } catch (err: any) {
      error = err.response?.data?.message || 'Failed to load car details';
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(e: Event) {
    try {
      e.preventDefault();
      loading = true;
      error = '';

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify({
        car_type: carType,
        company,
        dealer
      }));
      formData.append('keepImages', JSON.stringify(keepImages));

      // Append new images if any
      if (images) {
        Array.from(images).forEach((file) => {
          formData.append('images', file);
        });
      }

      await cars.update($page.params.id, formData);
      goto(`/cars/${$page.params.id}`);
    } catch (err: any) {
      console.error('Error updating car:', err);
      error = err.response?.data?.message || 'Failed to update car';
    } finally {
      loading = false;
    }
  }

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      images = target.files;
    }
  }

  function removeImage(index: number) {
    keepImages = keepImages.filter((_, i) => i !== index);
  }
</script>

<div class="container mx-auto p-4 max-w-2xl">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold">Edit Car</h1>
    <a 
      href={`/cars/${$page.params.id}`}
      class="text-blue-500 hover:underline"
    >
      Back to Details
    </a>
  </div>

  {#if loading && !car}
    <div class="text-center py-8">Loading...</div>
  {:else if error}
    <div class="bg-red-100 text-red-700 p-4 rounded mb-4">
      {error}
    </div>
  {:else}
    <form on:submit={handleSubmit} class="space-y-6">
      <div>
        <label class="block mb-2">Title</label>
        <input
          type="text"
          bind:value={title}
          class="w-full p-2 border rounded"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label class="block mb-2">Description</label>
        <textarea
          bind:value={description}
          class="w-full p-2 border rounded h-32"
          required
          disabled={loading}
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block mb-2">Car Type</label>
          <input
            type="text"
            bind:value={carType}
            class="w-full p-2 border rounded"
            placeholder="e.g., SUV, Sedan"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label class="block mb-2">Company</label>
          <input
            type="text"
            bind:value={company}
            class="w-full p-2 border rounded"
            placeholder="e.g., Toyota, BMW"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label class="block mb-2">Dealer</label>
          <input
            type="text"
            bind:value={dealer}
            class="w-full p-2 border rounded"
            placeholder="e.g., ABC Motors"
            required
            disabled={loading}
          />
        </div>
      </div>

      {#if keepImages.length > 0}
        <div>
          <label class="block mb-2">Current Images</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            {#each keepImages as image, index}
              <div class="relative">
                <img 
                  src={image} 
                  alt="Car" 
                  class="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  class="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                  on:click={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div>
        <label class="block mb-2">Add New Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          on:change={handleFileChange}
          class="w-full p-2 border rounded"
          disabled={loading}
        />
        <p class="text-sm text-gray-500 mt-1">
          Select new images to add to the existing ones
        </p>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Car'}
      </button>
    </form>
  {/if}
</div> 