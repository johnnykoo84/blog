<script>
	import { navItems } from '$lib/config';
	import NavItem from './NavItem.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<ul class="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8 list-none p-0 m-0">
	{#each navItems as page}
		<NavItem href={page.route}>
			{page.title}
		</NavItem>
	{/each}
	<li class="md:hidden flex justify-center items-center mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
		<ThemeToggle />
	</li>
</ul>
