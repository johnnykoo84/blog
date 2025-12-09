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
	<div class="text-center py-8">
		<p class="font-mono text-sm" style="color: rgb(var(--muted));">아직 댓글이 없습니다</p>
	</div>
{:else}
	<div class="space-y-3">
		{#each comments as comment (comment.id)}
			<div class="pb-3" style="border-bottom: 1px solid rgb(var(--muted));">
				<div class="mb-1">
					<span class="font-bold font-mono text-sm" style="color: rgb(var(--foreground));">{comment.author_name}</span>
					<time class="text-xs font-mono ml-2" style="color: rgb(var(--muted));" datetime={comment.created_at}>
						{formatDate(comment.created_at)}
					</time>
				</div>
				<p class="text-sm font-mono whitespace-pre-wrap break-words leading-relaxed" style="color: rgb(var(--foreground));">
					{comment.content}
				</p>
			</div>
		{/each}
	</div>
{/if}
