<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { Camera, Tag, Search, ChevronRight } from 'lucide-svelte';
    import { isAuthenticated } from '$lib/stores/auth';
  
    let showFeatures = false;
  
    const features = [
      { icon: Camera, title: 'Image Management', description: 'Upload and manage high-quality images for each car in your inventory.' },
      { icon: Tag, title: 'Detailed Information', description: 'Add comprehensive details including specifications and custom tags.' },
      { icon: Search, title: 'Smart Search', description: 'Quickly find cars using our powerful search functionality across all details.' },
    ];
  
    onMount(() => {
      setTimeout(() => {
        showFeatures = true;
      }, 500);
    });
  </script>
  
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Hero Section -->
    <header class="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6 leading-tight">
          Elevate Your Car Management Experience
        </h1>
        <p class="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          CarListKaro: The ultimate platform for managing, showcasing, and discovering exceptional vehicles.
        </p>
        <div class="space-x-4">
          {#if $isAuthenticated}
            <a href="/dashboard" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center">
              Go to Dashboard <ChevronRight class="ml-2 h-4 w-4" />
            </a>
          {:else}
            <a href="/register" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center">
              Get Started <ChevronRight class="ml-2 h-4 w-4" />
            </a>
            <a href="/login" class="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition">
              Login
            </a>
          {/if}
        </div>
      </div>
    </header>
  
    <!-- Features Section -->
    <section class="py-20 bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        {#if showFeatures}
          <div class="grid md:grid-cols-3 gap-8">
            {#each features as feature, index}
              <div 
                in:fly={{ y: 50, duration: 800, delay: index * 200 }}
                class="p-6 bg-gray-700 rounded-lg shadow-lg"
              >
                <svelte:component this={feature.icon} class="w-12 h-12 text-blue-400 mb-4" />
                <h3 class="text-xl font-semibold mb-4">{feature.title}</h3>
                <p class="text-gray-300">{feature.description}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </section>
  
    <!-- Featured Cars Section -->
    <!-- <section class="py-20 bg-gray-900">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Featured Cars</h2>
        <div class="grid md:grid-cols-3 gap-8">
          {#each [1, 2, 3] as car}
            <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img src="/placeholder.svg?height=200&width=300" alt="Featured Car {car}" class="w-full h-48 object-cover" />
              <div class="p-4">
                <h3 class="text-xl font-semibold mb-2">Featured Car {car}</h3>
                <p class="text-gray-300 mb-4">Experience luxury and performance.</p>
                <a href="/car/{car}" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View Details</a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section> -->
  
    <!-- Call to Action -->
    <section class="py-20 bg-gradient-to-br from-blue-900 to-gray-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Transform Your Car Management?</h2>
        <p class="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Join CarListKaro today and experience the future of automotive organization and discovery.
        </p>
        <a href="/register" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center">
          Get Started Now <ChevronRight class="ml-2 h-4 w-4" />
        </a>
      </div>
    </section>
  
    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-300 py-12">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-2xl font-bold mb-4">CarListKaro</h3>
            <p>Your ultimate car management platform.</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><a href="/about" class="hover:text-white transition">About Us</a></li>
              <li><a href="/features" class="hover:text-white transition">Features</a></li>
              <li><a href="/pricing" class="hover:text-white transition">Pricing</a></li>
              <li><a href="/contact" class="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">Stay Connected</h4>
            <p class="mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form class="flex gap-2">
              <input type="email" placeholder="Your email" class="flex-grow bg-gray-700 text-white border border-gray-600 rounded px-3 py-2" />
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Subscribe</button>
            </form>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          © {new Date().getFullYear()} CarListKaro. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
  
  <style lang="postcss">
    
  </style>