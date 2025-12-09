<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script>
	import Comments from '$lib/components/Comments.svelte';
	import { enableComments } from '$lib/config';

	let { data } = $props();

	const { title, excerpt, date, updated, coverImage, coverWidth, coverHeight, categories, slug } =
		data.meta;
	const { PostContent } = data;
	const postId = slug;
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
	<!-- Title -->
	<h1 class="text-xl font-bold font-mono mb-3" style="color: rgb(var(--foreground));">{title}</h1>

	<!-- Meta Info -->
	<div class="text-xs mb-6 font-mono pb-3" style="border-bottom: 1px solid rgb(var(--muted)); color: rgb(var(--muted));">
		<span>{date}</span>
		{#if updated}
			<span class="ml-3">Updated: {updated}</span>
		{/if}
		{#if categories && categories.length > 0}
			<span class="ml-3">
				{#each categories as category, i}
					<a href="/category/{category}/" style="color: rgb(var(--accent));">{category}</a>{#if i < categories.length - 1}, {/if}
				{/each}
			</span>
		{/if}
	</div>

	<!-- Post Content -->
	<div class="prose prose-lg max-w-none font-mono" style="color: rgb(var(--foreground));">
		<PostContent />
	</div>

	<!-- Comments Section -->
	{#if enableComments}
		<Comments {postId} />
	{/if}
</article>
