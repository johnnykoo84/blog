<script>
	let { children } = $props();
</script>

<div class="min-h-screen" style="background-color: rgb(var(--background)); color: rgb(var(--foreground))">
	{@render children?.()}
</div>
