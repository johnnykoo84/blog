<script>
	import { onMount } from 'svelte';
	import CommentForm from './CommentForm.svelte';
	import CommentList from './CommentList.svelte';

	let { postId } = $props();

	let comments = $state([]);
	let isLoading = $state(true);
	let error = $state('');

	async function fetchComments() {
		try {
			const response = await fetch(`/api/comments/${postId}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch comments');
			}

			comments = data.comments || [];
		} catch (err) {
			error = err.message;
			console.error('Error fetching comments:', err);
		} finally {
			isLoading = false;
		}
	}

	function handleCommentAdded(newComment) {
		comments = [...comments, newComment];
	}

	onMount(() => {
		fetchComments();
	});
</script>

<div class="mt-12">
	<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
		Comments ({comments.length})
	</h2>

	<div class="space-y-8">
		<!-- Comment Form -->
		<div class="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave a Comment</h3>
			<CommentForm {postId} onCommentAdded={handleCommentAdded} />
		</div>

		<!-- Comments List -->
		{#if isLoading}
			<div class="text-center py-12">
				<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
				<p class="mt-4 text-gray-500 dark:text-gray-400">Loading comments...</p>
			</div>
		{:else if error}
			<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
				<p class="text-sm text-red-600 dark:text-red-400">Error loading comments: {error}</p>
			</div>
		{:else}
			<CommentList {comments} />
		{/if}
	</div>
</div>
