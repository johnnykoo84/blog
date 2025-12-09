<script>
	import { isMenuOpen } from '../assets/js/store';
	import HamburgerMenuButton from './HamburgerMenuButton.svelte';
	import NavItems from './NavItems.svelte';
</script>

<!-- Mobile navigation overlay -->
<nav class="md:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out {$isMenuOpen ? 'translate-x-0' : '-translate-x-full'} bg-white dark:bg-slate-900">
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
<nav class="hidden md:flex md:items-center md:space-x-8 md:flex-1 md:justify-center md:pt-4 md:pb-4">
	<NavItems />
</nav>
