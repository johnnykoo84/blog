<script>
	import { isMenuOpen } from '../assets/js/store';
	import { Menu, X } from '@lucide/svelte';

	/**
	 * @typedef {Object} Props
	 * @property {boolean} [closeOnly]
	 */

	/** @type {Props} */
	let { closeOnly = false } = $props();

	const toggleIsMenuOpen = () => {
		isMenuOpen.set(!$isMenuOpen);
	};
</script>

<button
	onclick={toggleIsMenuOpen}
	aria-pressed={$isMenuOpen}
	class="p-1 flex items-center justify-center md:hidden text-xs"
	style="border: 1px solid rgb(var(--border)); background-color: transparent; color: rgb(var(--foreground));"
	tabindex={$isMenuOpen || !closeOnly ? '0' : '-1'}
>
	<span class="sr-only">Menu</span>
	{#if closeOnly}
		<X size={14} />
	{:else}
		<Menu size={14} />
	{/if}
</button>

