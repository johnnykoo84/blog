<script>
	import { onMount } from 'svelte';
	import { ThumbsUp, ThumbsDown } from '@lucide/svelte';

	let { postId } = $props();

	let likes = $state(0);
	let dislikes = $state(0);
	let userReaction = $state('none'); // 'none' | 'like' | 'dislike'
	let isLoading = $state(false);

	const storageKey = () => `reaction_${postId}`;

	onMount(async () => {
		// Restore from localStorage
		const saved = localStorage.getItem(storageKey());
		if (saved) userReaction = saved;

		try {
			const res = await fetch(`/api/reactions/${postId}`);
			const data = await res.json();
			likes = data.likes;
			dislikes = data.dislikes;
		} catch {
			// Silently fail
		}
	});

	async function react(action) {
		if (isLoading) return;
		isLoading = true;

		const previous = userReaction;

		try {
			const res = await fetch(`/api/reactions/${postId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action, previous })
			});
			const data = await res.json();
			likes = data.likes;
			dislikes = data.dislikes;

			// Update local state
			if (action === previous) {
				userReaction = 'none';
			} else {
				userReaction = action;
			}
			localStorage.setItem(storageKey(), userReaction);
		} catch {
			// Silently fail
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="inline-flex items-center gap-3 font-mono text-xs">
	<button
		onclick={() => react('like')}
		disabled={isLoading}
		class="inline-flex items-center gap-1 px-2 py-1 transition-colors"
		style="border: 1px solid rgb(var(--muted)); color: {userReaction === 'like'
			? 'rgb(var(--accent))'
			: 'rgb(var(--muted))'};"
	>
		<ThumbsUp size={14} />
		<span>{likes}</span>
	</button>
	<button
		onclick={() => react('dislike')}
		disabled={isLoading}
		class="inline-flex items-center gap-1 px-2 py-1 transition-colors"
		style="border: 1px solid rgb(var(--muted)); color: {userReaction === 'dislike'
			? 'rgb(255, 100, 100)'
			: 'rgb(var(--muted))'};"
	>
		<ThumbsDown size={14} />
		<span>{dislikes}</span>
	</button>
</div>
