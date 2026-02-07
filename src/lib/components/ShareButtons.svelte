<script>
	import { Share2 } from '@lucide/svelte';

	let { title, url } = $props();

	let copied = $state(false);

	function shareX() {
		const text = encodeURIComponent(title);
		const link = encodeURIComponent(url);
		window.open(`https://twitter.com/intent/tweet?text=${text}&url=${link}`, '_blank');
	}

	function shareFacebook() {
		const link = encodeURIComponent(url);
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}`, '_blank');
	}

	async function shareKakao() {
		// Try Web Share API first (mobile)
		if (navigator.share) {
			try {
				await navigator.share({ title, url });
				return;
			} catch {
				// User cancelled or API failed, fall through to clipboard
			}
		}

		// Fallback: copy to clipboard
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Last resort
			prompt('링크를 복사하세요:', url);
		}
	}
</script>

<div class="inline-flex items-center gap-2 font-mono text-xs" style="color: rgb(var(--muted));">
	<Share2 size={12} />
	<span>공유</span>
	<button
		onclick={shareX}
		class="px-2 py-1 hover:underline"
		style="border: 1px solid rgb(var(--muted)); color: rgb(var(--muted));"
	>
		X
	</button>
	<button
		onclick={shareFacebook}
		class="px-2 py-1 hover:underline"
		style="border: 1px solid rgb(var(--muted)); color: rgb(var(--muted));"
	>
		FB
	</button>
	<button
		onclick={shareKakao}
		class="px-2 py-1 hover:underline"
		style="border: 1px solid rgb(var(--muted)); color: rgb(var(--muted));"
	>
		{copied ? '복사됨!' : '카톡'}
	</button>
</div>
