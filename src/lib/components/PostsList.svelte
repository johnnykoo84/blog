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


<ul class="grid gap-4 list-none p-0 m-0">
	{#each posts as post}
		<li>
			<article style="border-bottom: 1px solid rgb(var(--muted)); padding-bottom: 16px;">
				<a href="/{post.slug}" class="block" style="color: inherit; text-decoration: none;">
					<h2 class="text-base font-bold mb-2" style="color: rgb(var(--foreground)); font-family: 'Courier New', monospace;">{post.title}</h2>
					<p class="mb-2 text-sm leading-relaxed" style="color: rgb(var(--muted)); font-family: 'Courier New', monospace;">{post.excerpt}</p>
					<div class="flex flex-wrap items-center gap-3 text-xs" style="color: rgb(var(--muted)); font-family: 'Courier New', monospace;">
						<time datetime={post.date}>{formatDate(post.date)}</time>
						{#if post.categories && post.categories.length > 0}
							<div class="flex gap-2 flex-wrap">
								{#each post.categories as category}
									<span class="text-xs" style="color: rgb(var(--accent));">[{category}]</span>
								{/each}
							</div>
						{/if}
					</div>
				</a>
			</article>
		</li>
	{/each}
</ul>

