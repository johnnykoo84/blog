<script>
	import PostEditor from '$lib/components/PostEditor.svelte';
	let { data, form } = $props();
</script>

<PostEditor post={data.post} {form} />
