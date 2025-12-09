<script>
	import { siteAuthor } from '$lib/config';
	import NavItems from './NavItems.svelte';
</script>

<footer class="mt-16" style="border-top: 1px solid rgb(var(--muted));">
	<div class="max-w-4xl mx-auto px-4 py-4">
		<nav class="mb-3">
			<NavItems />
		</nav>
		<div class="text-center pt-3" style="border-top: 1px solid rgb(var(--muted));">
			<p class="font-mono text-xs" style="color: rgb(var(--muted));">
				{new Date().getFullYear()} {siteAuthor}
			</p>
		</div>
	</div>
</footer>
