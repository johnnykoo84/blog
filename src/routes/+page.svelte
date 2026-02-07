<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import { Settings } from '@lucide/svelte'
	import { siteTitle, siteDescription } from '$lib/config'

	let { data } = $props();
</script>


<svelte:head>
	<title>{siteTitle}</title>
	<meta data-key="description" name="description" content={siteDescription}>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-xl font-bold font-mono" style="color: rgb(var(--foreground));">Blog</h1>
		<a href="/admin" class="opacity-40 hover:opacity-100" title="Admin">
			<Settings size={16} />
		</a>
	</div>

	<PostsList posts={data.posts} />

	<Pagination currentPage={1} totalPosts={data.total} />
</div>