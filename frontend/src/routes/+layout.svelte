<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated } from '$lib/stores/auth';
  import Navigation from '$lib/components/Navigation.svelte';
  import '../app.css';

  onMount(() => {
    isAuthenticated.check();
  });
</script>

<Navigation />
<slot /> 