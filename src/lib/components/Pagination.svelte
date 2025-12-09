<script>
	import { postsPerPage } from '$lib/config'

	/**
	 * @typedef {Object} Props
	 * @property {any} currentPage
	 * @property {any} totalPosts
	 * @property {string} [path]
	 */

	/** @type {Props} */
	let { currentPage, totalPosts, path = '/page' } = $props();
	
	let pagesAvailable = $derived(Math.ceil(totalPosts / postsPerPage))
	

	const isCurrentPage = (page) => page == currentPage
</script>

<!-- For some reason, the pagination wasn't re-rendering properly during navigation without the #key block -->
{#key currentPage}
	{#if pagesAvailable > 1}
		<nav aria-label="Pagination" class="mt-8 pt-4" style="border-top: 1px solid rgb(var(--muted));">
			<ul class="flex flex-wrap justify-center gap-2 list-none p-0 m-0">
				{#each Array.from({length: pagesAvailable}, (_, i) => i + 1) as page}
					<li>
						<a
							href="{path}/{page}"
							aria-current="{isCurrentPage(page)}"
							class="flex items-center justify-center w-8 h-8 text-sm font-mono"
							style="{isCurrentPage(page)
								? 'color: rgb(var(--foreground)); text-decoration: underline;'
								: 'color: rgb(var(--muted)); text-decoration: none;'}"
						>
							<span class="sr-only">
								{#if isCurrentPage(page)}
									Current page:
								{:else}
									Go to page
								{/if}
							</span>
							{page}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
{/key}