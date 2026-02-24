<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script>
	import Comments from '$lib/components/Comments.svelte';
	import ViewCount from '$lib/components/ViewCount.svelte';
	import LikeDislike from '$lib/components/LikeDislike.svelte';
	import ShareButtons from '$lib/components/ShareButtons.svelte';
	import { enableComments, siteLink } from '$lib/config';
	import { Settings } from '@lucide/svelte';

	let { data } = $props();

	const { title, excerpt, date, updated, coverImage, coverWidth, coverHeight, categories, slug } =
		data.meta;
	const PostContent = data.PostContent;
	const htmlContent = data.htmlContent;
	const isDbPost = data.source === 'db';
	const isAdmin = data.isAdmin;
	const isDraft = data.isDraft;
	const postId = slug;
	const pageUrl = `${siteLink}/${slug}`;
	const ogImageUrl = `${siteLink}/api/og/${slug}?title=${encodeURIComponent(title)}`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta data-key="description" name="description" content={excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:site_name" content="bloKoo" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={excerpt} />
	<meta name="twitter:image" content={ogImageUrl} />
</svelte:head>

<article class="max-w-4xl mx-auto px-4 py-8">
	{#if isDraft}
		<div class="mb-4 px-3 py-2 text-xs font-mono rounded border" style="color: rgb(var(--accent)); border-color: rgb(var(--accent)); background: rgba(var(--accent), 0.1);">
			Draft — only visible to admins
		</div>
	{/if}

	<!-- Title -->
	<div class="flex items-center gap-2 mb-3">
		<h1 class="text-xl font-bold font-mono" style="color: rgb(var(--foreground));">{title}</h1>
		{#if isAdmin}
			<a href="/admin/posts/{slug}/edit" title="Edit post" class="opacity-40 hover:opacity-100 transition-opacity" style="color: rgb(var(--muted));">
				<Settings size={18} />
			</a>
		{/if}
	</div>

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
		<span class="ml-3">
			<ViewCount {postId} />
		</span>
	</div>

	<!-- Post Content -->
	<div class="prose prose-lg max-w-none font-mono" style="color: rgb(var(--foreground));">
		{#if isDbPost}
			{@html htmlContent}
		{:else}
			<PostContent />
		{/if}
	</div>

	<!-- Engagement Bar -->
	<div class="mt-8 py-4 font-mono" style="border-top: 1px solid rgb(var(--muted));">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<LikeDislike {postId} />
			<ShareButtons {title} url={pageUrl} />
		</div>
	</div>

	<!-- Comments Section -->
	{#if enableComments}
		<Comments {postId} />
	{/if}
</article>
