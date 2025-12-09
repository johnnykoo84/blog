<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';

	let { appId, pageId = $page.url.pathname, pageTitle, pageUrl = $page.url.href } = $props();

	let cusdisElement;
	let currentTheme = $derived($theme);

	onMount(() => {
		// Load Cusdis script
		const script = document.createElement('script');
		script.src = 'https://cusdis.com/js/cusdis.es.js';
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		script.onload = () => {
			// Initialize Cusdis after script loads
			if (window.CUSDIS) {
				window.CUSDIS.renderTo(cusdisElement);
			}
		};

		return () => {
			// Cleanup script on unmount
			if (script.parentNode) {
				script.parentNode.removeChild(script);
			}
		};
	});
</script>

<div
	bind:this={cusdisElement}
	id="cusdis_thread"
	data-host="https://cusdis.com"
	data-app-id={appId}
	data-page-id={pageId}
	data-page-url={pageUrl}
	data-page-title={pageTitle}
	data-theme={currentTheme}
	class="cusdis-wrapper"
>
	<!-- Cusdis will render here -->
</div>

