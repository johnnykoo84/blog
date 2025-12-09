<script>
	import { preventDefault } from 'svelte/legacy';

	import MainNav from './MainNav.svelte'
	import HamburgerMenuButton from './HamburgerMenuButton.svelte'
	import { siteTitle } from '$lib/config'

	const focusMain = () => {
		const main = document.querySelector('main');
		main.focus();
	}
</script>


<header style="background-color: rgb(var(--background)); color: rgb(var(--foreground)); border-bottom: 1px solid rgb(var(--border));" class="sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-12">
			<a onclick={preventDefault(focusMain)} class="sr-only focus:not-sr-only focus:absolute focus:top-4 left-4 px-3 py-1 z-50" style="background-color: rgb(var(--primary)); color: rgb(var(--primary-foreground)); border: 1px solid rgb(var(--border));" href="#main">
				Skip to main content
			</a>

			<a href="/" class="text-sm flex-shrink-0 truncate max-w-[calc(100vw-80px)] md:max-w-none" style="color: rgb(var(--foreground)); text-decoration: none; font-family: 'Press Start 2P', monospace;">
				{siteTitle}
			</a>

			<div class="flex items-center">
				<HamburgerMenuButton />
			</div>
		</div>
	</div>
	<MainNav />
</header>