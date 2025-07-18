<script>
	import { currentPage, isMenuOpen } from '../assets/js/store';

	let { href, children } = $props();

	let isCurrentPage = $derived($currentPage.startsWith(href));

	const maybeCloseMenu = () => {
		if (href != $currentPage) {
			isMenuOpen.set(false);
		}
	};
</script>

<li>
	<a
		{href}
		onclick={maybeCloseMenu}
		class="block px-4 py-2 text-lg md:text-base font-medium rounded-md transition-colors duration-200 text-center md:text-left {isCurrentPage ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-purple-400'}"
		aria-current={isCurrentPage ? 'page' : false}
	>
		{@render children?.()}
	</a>
</li>
