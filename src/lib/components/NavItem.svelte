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
		class="block px-2 py-1 text-sm text-center md:text-left"
		style="{isCurrentPage
			? 'color: rgb(var(--foreground)); text-decoration: underline;'
			: 'color: rgb(var(--muted)); text-decoration: none;'}"
		aria-current={isCurrentPage ? 'page' : false}
	>
		{@render children?.()}
	</a>
</li>
