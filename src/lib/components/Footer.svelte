<script>
	import { siteAuthor } from '$lib/config';
	import NavItems from './NavItems.svelte';
</script>

<footer class="bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-16 transition-colors duration-300">
	<div class="max-w-4xl mx-auto px-4 py-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<nav>
				<ul class="space-y-2">
					<li>
						<a href="/" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</a>
					</li>
				</ul>
			</nav>
			<nav class="md:col-span-2">
				<NavItems />
			</nav>
		</div>
		<div class="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
			<p class="text-center text-gray-500 dark:text-gray-400 text-sm">&copy;{new Date().getFullYear()} {siteAuthor}</p>
		</div>
	</div>
</footer>
