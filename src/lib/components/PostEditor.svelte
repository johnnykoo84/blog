<script>
	import { marked } from 'marked';

	let { post = {}, form = null } = $props();

	let activeTab = $state('write');
	let title = $state(post.title ?? form?.title ?? '');
	let slug = $state(post.slug ?? form?.slug ?? '');
	let categories = $state(post.categories ?? form?.categories ?? '');
	let excerpt = $state(post.excerpt ?? form?.excerpt ?? '');
	let content = $state(post.content ?? form?.content ?? '');
	let published = $state(post.published ?? false);

	let previewHtml = $derived(marked(content || ''));

	function generateSlug() {
		slug = title
			.toLowerCase()
			.replace(/[^a-z0-9가-힣\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-lg font-bold">{post.slug ? '[ EDIT POST ]' : '[ NEW POST ]'}</h1>
		<a href="/admin" class="btn">← BACK</a>
	</div>

	{#if form?.error}
		<p class="text-red-400 text-sm mb-4">{form.error}</p>
	{/if}

	<form method="POST" class="space-y-4">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="title" class="block text-sm mb-1">Title</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					oninput={generateSlug}
					required
					class="w-full bg-transparent border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white/10"
				/>
			</div>
			<div>
				<label for="slug" class="block text-sm mb-1">Slug</label>
				<input
					type="text"
					id="slug"
					name="slug"
					bind:value={slug}
					required
					class="w-full bg-transparent border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white/10"
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="categories" class="block text-sm mb-1">Categories (comma-separated)</label>
				<input
					type="text"
					id="categories"
					name="categories"
					bind:value={categories}
					placeholder="정리, 기술"
					class="w-full bg-transparent border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white/10"
				/>
			</div>
			<div>
				<label for="excerpt" class="block text-sm mb-1">Excerpt</label>
				<input
					type="text"
					id="excerpt"
					name="excerpt"
					bind:value={excerpt}
					class="w-full bg-transparent border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white/10"
				/>
			</div>
		</div>

		<!-- GitHub-style tabs -->
		<div>
			<div class="flex border-b border-white">
				<button
					type="button"
					onclick={() => (activeTab = 'write')}
					class="px-4 py-2 text-sm {activeTab === 'write'
						? 'border border-white border-b-0 bg-white/10'
						: 'opacity-50 hover:opacity-100'}"
				>
					Write
				</button>
				<button
					type="button"
					onclick={() => (activeTab = 'preview')}
					class="px-4 py-2 text-sm {activeTab === 'preview'
						? 'border border-white border-b-0 bg-white/10'
						: 'opacity-50 hover:opacity-100'}"
				>
					Preview
				</button>
			</div>

			{#if activeTab === 'write'}
				<textarea
					id="content"
					name="content"
					bind:value={content}
					rows="20"
					required
					placeholder="Write your markdown here..."
					class="w-full bg-black/30 border border-white border-t-0 px-4 py-3 text-sm font-mono focus:outline-none resize-y"
				></textarea>
			{:else}
				<div
					class="w-full bg-black/30 border border-white border-t-0 px-4 py-3 min-h-[480px] prose prose-invert prose-sm max-w-none"
				>
					{#if content}
						{@html previewHtml}
					{:else}
						<p class="opacity-50">Nothing to preview</p>
					{/if}
				</div>
				<!-- Hidden input so content is still submitted when on Preview tab -->
				<input type="hidden" name="content" value={content} />
			{/if}
		</div>

		<div class="flex items-center justify-between">
			<label class="flex items-center gap-2 text-sm cursor-pointer">
				<input type="checkbox" name="published" bind:checked={published} class="accent-white" />
				Published
			</label>

			<button type="submit" class="btn">
				{post.slug ? 'UPDATE' : 'CREATE'} POST
			</button>
		</div>
	</form>
</div>
