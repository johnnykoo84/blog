<script>
	let { postId, onCommentAdded } = $props();

	let name = $state('');
	let email = $state('');
	let comment = $state('');
	let isSubmitting = $state(false);
	let error = $state('');
	let success = $state(false);

	async function handleSubmit(e) {
		e.preventDefault();
		error = '';
		success = false;
		isSubmitting = true;

		try {
			const response = await fetch(`/api/comments/${postId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					author_name: name,
					author_email: email,
					content: comment
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to post comment');
			}

			// Success!
			success = true;
			comment = '';
			name = '';
			email = '';

			// Notify parent component
			if (onCommentAdded) {
				onCommentAdded(data.comment);
			}

			// Clear success message after 3 seconds
			setTimeout(() => {
				success = false;
			}, 3000);
		} catch (err) {
			error = err.message;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-3">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
		<div>
			<label for="name" class="block text-xs mb-1 font-mono" style="color: rgb(var(--foreground));">
				이름 *
			</label>
			<input
				id="name"
				type="text"
				bind:value={name}
				required
				maxlength="100"
				placeholder="이름"
				disabled={isSubmitting}
				class="w-full px-2 py-1 text-sm font-mono"
				style="border: 1px solid rgb(var(--border)); background-color: rgba(0, 0, 0, 0.2); color: rgb(var(--foreground));"
			/>
		</div>

		<div>
			<label for="email" class="block text-xs mb-1 font-mono" style="color: rgb(var(--foreground));">
				이메일
			</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				maxlength="255"
				placeholder="선택사항"
				disabled={isSubmitting}
				class="w-full px-2 py-1 text-sm font-mono"
				style="border: 1px solid rgb(var(--border)); background-color: rgba(0, 0, 0, 0.2); color: rgb(var(--foreground));"
			/>
		</div>
	</div>

	<div>
		<label for="comment" class="block text-xs mb-1 font-mono" style="color: rgb(var(--foreground));">
			댓글 *
		</label>
		<textarea
			id="comment"
			bind:value={comment}
			required
			maxlength="5000"
			rows="4"
			placeholder="댓글을 입력하세요"
			disabled={isSubmitting}
			class="w-full px-2 py-1 text-sm font-mono resize-vertical"
			style="border: 1px solid rgb(var(--border)); background-color: rgba(0, 0, 0, 0.2); color: rgb(var(--foreground));"
		></textarea>
	</div>

	{#if error}
		<div class="p-2 text-sm font-mono" style="color: rgb(255, 100, 100);">
			{error}
		</div>
	{/if}

	{#if success}
		<div class="p-2 text-sm font-mono" style="color: rgb(var(--accent));">
			댓글이 등록되었습니다
		</div>
	{/if}

	<button
		type="submit"
		disabled={isSubmitting}
		class="px-4 py-1 text-sm font-mono"
		style="{isSubmitting ? 'border: 1px solid rgb(var(--muted)); background-color: transparent; color: rgb(var(--muted)); cursor: not-allowed;' : 'border: 1px solid rgb(var(--border)); background-color: transparent; color: rgb(var(--foreground)); cursor: pointer;'}"
	>
		{isSubmitting ? '등록중...' : '등록'}
	</button>
</form>
