<!-- Renders any page at /category/* -->
<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
  import { postsPerPage } from '$lib/config'

	let { data } = $props();

  const { page, posts, category, total } = data

	let lowerBound = $derived((page * postsPerPage) - (postsPerPage - 1) || 1)
	let upperBound = $derived(Math.min(page * postsPerPage, total))
</script>


<svelte:head>
	<title>Category: {category}</title>
</svelte:head>


<h1>Blog category: {category}</h1>

{#if posts.length}
	<PostsList posts={posts} />
	<Pagination currentPage={page} totalPosts={total} path="/category/{category}/page" />
{:else}
	<p><strong>Ope!</strong> Sorry, couldn't find any posts in the category "{category}".</p>

	<p><a href="/">Back to blog</a></p>
{/if}