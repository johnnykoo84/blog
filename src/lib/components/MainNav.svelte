<script>
	import { isMenuOpen } from '../assets/js/store';
	import HamburgerMenuButton from './HamburgerMenuButton.svelte';
	import NavItems from './NavItems.svelte';
</script>

<!-- Mobile navigation overlay -->
<nav class="md:hidden fixed inset-0 z-40 transform {$isMenuOpen ? 'translate-x-0' : '-translate-x-full'}" style="background-color: rgb(var(--background)); border: 1px solid rgb(var(--border));">
	<div class="flex flex-col h-full pt-16 pb-8 px-4">
		<div class="absolute top-4 right-4">
			<HamburgerMenuButton closeOnly="true" />
		</div>
		<div class="flex-1 flex items-center justify-center">
			<NavItems />
		</div>
	</div>
</nav>

<!-- Desktop navigation -->
<nav class="hidden md:flex md:items-center md:space-x-6 md:flex-1 md:justify-center md:py-2" style="background-color: rgba(0, 0, 0, 0.2); border-top: 1px solid rgb(var(--muted));">
	<NavItems />
</nav>
