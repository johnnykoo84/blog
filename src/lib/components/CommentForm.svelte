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

<form onsubmit={handleSubmit} class="space-y-4">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				Name <span class="text-red-500">*</span>
			</label>
			<input
				id="name"
				type="text"
				bind:value={name}
				required
				maxlength="100"
				placeholder="Your name"
				disabled={isSubmitting}
				class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
			/>
		</div>

		<div>
			<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				Email <span class="text-gray-400 text-xs">(optional)</span>
			</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				maxlength="255"
				placeholder="your@email.com"
				disabled={isSubmitting}
				class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
			/>
		</div>
	</div>

	<div>
		<label for="comment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
			Comment <span class="text-red-500">*</span>
		</label>
		<textarea
			id="comment"
			bind:value={comment}
			required
			maxlength="5000"
			rows="5"
			placeholder="Write your comment..."
			disabled={isSubmitting}
			class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-vertical disabled:opacity-50"
		></textarea>
		<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
			{comment.length} / 5000 characters
		</p>
	</div>

	{#if error}
		<div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
			<p class="text-sm text-red-600 dark:text-red-400">{error}</p>
		</div>
	{/if}

	{#if success}
		<div class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
			<p class="text-sm text-green-600 dark:text-green-400">Comment posted successfully!</p>
		</div>
	{/if}

	<button
		type="submit"
		disabled={isSubmitting}
		class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
	>
		{isSubmitting ? 'Posting...' : 'Post Comment'}
	</button>
</form>
