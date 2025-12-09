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
		<nav aria-label="Pagination navigation" class="mt-12">
			<ul class="flex flex-wrap justify-center gap-2 list-none p-0 m-0">
				{#each Array.from({length: pagesAvailable}, (_, i) => i + 1) as page}
					<li>
						<a 
							href="{path}/{page}" 
							aria-current="{isCurrentPage(page)}"
							class="flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 border
								{isCurrentPage(page)
									? 'bg-blue-600 text-white border-blue-600 shadow-lg'
									: 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400'
								}"
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