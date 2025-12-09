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

<div class="mt-12" style="border-top: 1px solid rgb(var(--muted)); padding-top: 16px;">
	<h2 class="font-mono text-base font-bold mb-4" style="color: rgb(var(--foreground));">
		댓글 ({comments.length})
	</h2>

	<div class="space-y-4">
		<!-- Comment Form -->
		<div class="p-3" style="border: 1px solid rgb(var(--muted));">
			<h3 class="font-mono text-sm mb-3" style="color: rgb(var(--foreground));">댓글 작성</h3>
			<CommentForm {postId} onCommentAdded={handleCommentAdded} />
		</div>

		<!-- Comments List -->
		{#if isLoading}
			<div class="text-center py-8">
				<p class="font-mono text-sm" style="color: rgb(var(--muted));">로딩중...</p>
			</div>
		{:else if error}
			<div class="p-2 text-sm font-mono" style="color: rgb(255, 100, 100);">
				{error}
			</div>
		{:else}
			<CommentList {comments} />
		{/if}
	</div>
</div>
