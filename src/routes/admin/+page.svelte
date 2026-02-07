<script>
	let { data } = $props();
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-lg font-bold">[ ADMIN DASHBOARD ]</h1>
		<div class="flex gap-4">
			<a href="/admin/posts/new" class="btn">+ NEW POST</a>
			<form method="POST" action="/admin/logout">
				<button type="submit" class="btn">LOGOUT</button>
			</form>
		</div>
	</div>

	<div class="border border-white">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-white">
					<th class="text-left px-3 py-2">Title</th>
					<th class="text-left px-3 py-2 w-24">Status</th>
					<th class="text-left px-3 py-2 w-32">Date</th>
					<th class="text-left px-3 py-2 w-20">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.posts as post}
					<tr class="border-b border-white/20">
						<td class="px-3 py-2">{post.title}</td>
						<td class="px-3 py-2">
							{#if post.published}
								<span class="text-green-400">[LIVE]</span>
							{:else}
								<span class="text-yellow-400">[DRAFT]</span>
							{/if}
						</td>
						<td class="px-3 py-2 text-xs">{new Date(post.created_at).toLocaleDateString()}</td>
						<td class="px-3 py-2">
							<a href="/admin/posts/{post.slug}/edit" class="underline">Edit</a>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="px-3 py-8 text-center opacity-50">No posts yet. Create your first one!</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
