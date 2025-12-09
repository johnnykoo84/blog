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
  class="p-2 flex items-center justify-center font-bold uppercase text-sm"
  style="border: 3px dotted rgb(var(--border)); background-color: rgb(var(--accent)); color: rgb(var(--primary-foreground)); box-shadow: 3px 3px 0px rgba(0,0,0,0.3);"
  onclick={handleToggle}
  aria-label="Toggle {currentTheme === 'light' ? 'dark' : 'light'} mode"
  title="Toggle {currentTheme === 'light' ? 'dark' : 'light'} mode"
>
  {#if currentTheme === 'light'}
    <Moon size={20} strokeWidth={2} />
  {:else}
    <Sun size={20} strokeWidth={2} />
  {/if}
</button>
