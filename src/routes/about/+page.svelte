<script>
	import { siteTitle } from '$lib/config';
</script>

<svelte:head>
	<title>About - {siteTitle}</title>
</svelte:head>

<article class="max-w-4xl mx-auto px-4 py-8">
	<h1 class="text-xl font-bold font-mono mb-6" style="color: rgb(var(--foreground)); border-bottom: 1px solid rgb(var(--muted)); padding-bottom: 12px;">About</h1>

	<div class="prose prose-lg max-w-none font-mono" style="color: rgb(var(--foreground));">
		<p>개인적인 생각을 기록하고 있습니다.</p>
		<p>연락처: johnnykoo84@gmail.com</p>
	</div>
</article>
