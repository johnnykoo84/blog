<script>
	import { enhance } from '$app/forms';
	import { theme } from '$lib/stores/theme.js';
	import { themes, themeIds } from '$lib/themes.js';

	let { data } = $props();

	let activeAdminTab = $state('posts');

	// Apply theme whenever activeTheme changes (after form action)
	$effect(() => {
		if (data.activeTheme) {
			theme.apply(data.activeTheme);
		}
	});
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

	<!-- Tab bar -->
	<div class="flex items-center border-b border-white mb-6">
		<button
			type="button"
			onclick={() => (activeAdminTab = 'posts')}
			class="px-4 py-2 text-sm {activeAdminTab === 'posts'
				? 'border border-white border-b-0 bg-white/10'
				: 'opacity-50 hover:opacity-100'}"
		>
			Posts
		</button>
		<button
			type="button"
			onclick={() => (activeAdminTab = 'theme')}
			class="px-4 py-2 text-sm {activeAdminTab === 'theme'
				? 'border border-white border-b-0 bg-white/10'
				: 'opacity-50 hover:opacity-100'}"
		>
			Theme
		</button>
	</div>

	{#if activeAdminTab === 'posts'}
	<div class="border border-white">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-white">
					<th class="text-left px-3 py-2">Title</th>
					<th class="text-left px-3 py-2 w-24">Status</th>
					<th class="text-right px-3 py-2 w-20">Views</th>
					<th class="text-center px-3 py-2 w-24">+/-</th>
					<th class="text-right px-3 py-2 w-16">Cmts</th>
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
						<td class="px-3 py-2 text-right tabular-nums">{post.view_count}</td>
						<td class="px-3 py-2 text-center tabular-nums">
							<span class="text-green-400">{post.likes}</span>/<span class="text-red-400">{post.dislikes}</span>
						</td>
						<td class="px-3 py-2 text-right tabular-nums">{post.comment_count}</td>
						<td class="px-3 py-2 text-xs">{new Date(post.created_at).toLocaleDateString()}</td>
						<td class="px-3 py-2">
							<a href="/admin/posts/{post.slug}/edit" class="underline">Edit</a>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="7" class="px-3 py-8 text-center opacity-50">No posts yet. Create your first one!</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	{/if}

	{#if activeAdminTab === 'theme'}
	<!-- Theme Settings -->
	<div>
		<h2 class="text-lg font-bold mb-4">[ THEME SETTINGS ]</h2>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
			{#each themeIds as id}
				{@const t = themes[id]}
				<form method="POST" action="?/setTheme" use:enhance>
					<input type="hidden" name="theme" value={id} />
					<button
						type="submit"
						class="w-full text-left p-3 border-2 transition-none"
						style="
							background-color: rgb({t.vars.background});
							color: rgb({t.vars.foreground});
							border-color: {data.activeTheme === id ? `rgb(${t.vars.foreground})` : `rgb(${t.vars.border})`};
							{data.activeTheme === id ? 'box-shadow: 0 0 0 2px rgb(' + t.vars.foreground + ');' : ''}
						"
					>
						<div class="text-xs font-bold mb-1" style="color: rgb({t.vars.primary})">
							{data.activeTheme === id ? '> ' : ''}{t.name}
							<span class="opacity-70">({t.nameKr})</span>
						</div>
						<div class="text-xs font-mono">Abc 가나다 123</div>
						<div class="text-xs mt-1" style="color: rgb({t.vars.link})">link</div>
					</button>
				</form>
			{/each}
		</div>
	</div>
	{/if}
</div>
