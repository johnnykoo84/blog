<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script>
	let { data } = $props();

	const { title, excerpt, date, updated, coverImage, coverWidth, coverHeight, categories } =
		data.meta;
	const { PostContent } = data;
</script>

<svelte:head>
	<!-- Be sure to add your image files and un-comment the lines below -->
	<title>{title}</title>
	<meta data-key="description" name="description" content={excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta name="twitter:description" content={excerpt} />
	<!-- <meta property="og:image" content="https://yourdomain.com/image_path" /> -->
	<meta property="og:image:width" content={coverWidth} />
	<meta property="og:image:height" content={coverHeight} />
	<!-- <meta name="twitter:image" content="https://yourdomain.com/image_path" /> -->
</svelte:head>

<article class="max-w-4xl mx-auto px-4 py-8">
	<!-- You might want to add an alt frontmatter attribute. If not, leaving alt blank here works, too. -->
	{#if coverImage}
		<img
			class="w-full h-auto rounded-lg shadow-lg mb-8"
			src={coverImage}
			alt=""
			style="aspect-ratio: {coverWidth} / {coverHeight};"
			width={coverWidth}
			height={coverHeight}
		/>
	{/if}

	<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>

	<div class="text-sm text-gray-600 dark:text-gray-400 mb-8 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
		<p><span class="font-semibold">Published:</span> {date}</p>
		{#if updated}
			<p><span class="font-semibold">Updated:</span> {updated}</p>
		{/if}
	</div>

	<div class="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white">
		<PostContent />
	</div>

	{#if categories}
		<aside class="mt-12 p-6 bg-gray-50 dark:bg-slate-800 rounded-lg">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Posted in:</h2>
			<ul class="flex flex-wrap gap-2">
				{#each categories as category}
					<li>
						<a
							href="/category/{category}/"
							class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
						>
							{category}
						</a>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</article>
