<script>
	import { preventDefault } from 'svelte/legacy';

	import MainNav from './MainNav.svelte'
	import HamburgerMenuButton from './HamburgerMenuButton.svelte'
	import ThemeToggle from './ThemeToggle.svelte'
	import { siteTitle } from '$lib/config'

	const focusMain = () => {
		const main = document.querySelector('main');
		main.focus();
	}
</script>


<header class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm sticky top-0 z-50 transition-colors duration-300">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<a onclick={preventDefault(focusMain)} class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded transition-all duration-200 z-50" href="#main">
				Skip to main content
			</a>
			
			<a href="/" class="text-xl font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex-shrink-0 truncate max-w-[calc(100vw-140px)] md:max-w-none">
				{siteTitle}
			</a>
			
			<div class="flex items-center space-x-2">
				<div class="hidden md:block">
					<ThemeToggle />
				</div>
				<HamburgerMenuButton />
			</div>
		</div>
	</div>
	<MainNav />
</header>