<script>
	let { posts = [] } = $props();
	
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('ko-KR', { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	}
</script>


<ul class="grid gap-8 list-none p-0 m-0">
	{#each posts as post}
		<li>
			<article class="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600">
				<a href="/{post.slug}" class="block text-inherit no-underline">
					{#if post.coverImage}
						<div class="aspect-video overflow-hidden bg-purple-50 dark:bg-purple-900/20">
							<img
								src={post.coverImage}
								alt=""
								width={post.coverWidth}
								height={post.coverHeight}
								class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
								style="aspect-ratio: {post.coverWidth} / {post.coverHeight}"
							/>
						</div>
					{/if}
					<div class="p-6">
						<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200 hover:text-purple-600 dark:hover:text-purple-400">{post.title}</h2>
						<p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{post.excerpt}</p>
						<div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
							<time datetime={post.date}>{formatDate(post.date)}</time>
							{#if post.categories && post.categories.length > 0}
								<div class="flex gap-2 flex-wrap">
									{#each post.categories as category}
										<span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium transition-colors duration-200 hover:bg-purple-200 dark:hover:bg-purple-800">{category}</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</a>
			</article>
		</li>
	{/each}
</ul>

