<script>
	let { comments = [] } = $props();

	function formatDate(dateString) {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'just now';
		if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
		if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
		if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

		return date.toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

{#if comments.length === 0}
	<div class="text-center py-12">
		<p class="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
	</div>
{:else}
	<div class="space-y-6">
		{#each comments as comment (comment.id)}
			<div class="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
				<div class="flex items-start justify-between mb-3">
					<div>
						<h4 class="font-semibold text-gray-900 dark:text-white">{comment.author_name}</h4>
						<time class="text-sm text-gray-500 dark:text-gray-400" datetime={comment.created_at}>
							{formatDate(comment.created_at)}
						</time>
					</div>
				</div>
				<div class="prose prose-sm dark:prose-invert max-w-none">
					<p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
						{comment.content}
					</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
