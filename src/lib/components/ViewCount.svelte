<script>
	import { onMount } from 'svelte';
	import { Eye } from '@lucide/svelte';

	let { postId } = $props();

	let viewCount = $state(0);

	onMount(async () => {
		try {
			const res = await fetch(`/api/views/${postId}`, { method: 'POST' });
			const data = await res.json();
			viewCount = data.viewCount;
		} catch {
			// Silently fail - view count is non-critical
		}
	});
</script>

<span class="inline-flex items-center gap-1">
	<Eye size={12} />
	<span>조회 {viewCount}</span>
</span>
