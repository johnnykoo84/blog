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
	class="p-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 flex items-center justify-center md:hidden"
	tabindex={$isMenuOpen || !closeOnly ? '0' : '-1'}
>
	<span class="sr-only">Toggle hamburger menu</span>
	{#if closeOnly}
		<X size={20} />
	{:else}
		<Menu size={20} />
	{/if}
</button>

