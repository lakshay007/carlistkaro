<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/stores/auth';
  import { cars } from '$lib/api';

  let title = '';
  let description = '';
  let carType = '';
  let company = '';
  let dealer = '';
  let images: FileList | null = null;
  let error = '';
  let loading = false;

  onMount(() => {
    if (!$isAuthenticated) {
      goto('/login');
    }
  });

  async function handleSubmit(e: Event) {
    try {
      e.preventDefault();
      loading = true;
      error = '';

      if (!images || images.length === 0) {
        error = 'Please select at least one image';
        return;
      }

      if (images.length > 10) {
        error = 'Maximum 10 images allowed';
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify({
        car_type: carType,
        company,
        dealer
      }));

      // Append all images
      Array.from(images).forEach((file) => {
        formData.append('images', file);
      });

      const response = await cars.create(formData);
      console.log('Car created:', response.data);
      goto('/dashboard');
    } catch (err: any) {
      console.error('Error creating car:', err);
      error = err.response?.data?.message || 'Failed to create car listing';
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
</script>

<div class="container mx-auto p-4 max-w-2xl">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold">Add New Car</h1>
    <a 
      href="/dashboard"
      class="text-blue-500 hover:underline"
    >
      Back to Dashboard
    </a>
  </div>

  {#if error}
    <div class="bg-red-100 text-red-700 p-4 rounded mb-4">
      {error}
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
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

    <div>
      <label class="block mb-2">Images (Max 10)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        on:change={handleFileChange}
        class="w-full p-2 border rounded"
        required
        disabled={loading}
      />
      <p class="text-sm text-gray-500 mt-1">Select up to 10 images</p>
    </div>

    <button
      type="submit"
      class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      disabled={loading}
    >
      {loading ? 'Creating...' : 'Create Car Listing'}
    </button>
  </form>
</div> 