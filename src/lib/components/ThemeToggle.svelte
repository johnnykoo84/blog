<script>
  import { theme } from '$lib/stores/theme';
  import { Sun, Moon } from '@lucide/svelte';

  let currentTheme = $theme;
  
  $: currentTheme = $theme;

  function handleToggle() {
    theme.toggle();
  }
</script>

<button 
  class="p-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 flex items-center justify-center group" 
  onclick={handleToggle}
  aria-label="Toggle {currentTheme === 'light' ? 'dark' : 'light'} mode"
  title="Toggle {currentTheme === 'light' ? 'dark' : 'light'} mode"
>
  {#if currentTheme === 'light'}
    <Moon size={20} strokeWidth={2} class="group-hover:rotate-12 transition-transform duration-300" />
  {:else}
    <Sun size={20} strokeWidth={2} class="group-hover:rotate-12 transition-transform duration-300" />
  {/if}
</button>
