<script>
	import { marked } from 'marked';
	import { SpellCheck, X, LoaderCircle, ChevronDown } from '@lucide/svelte';

	let { post = {}, form = null } = $props();

	let activeTab = $state('write');
	let title = $state(post.title ?? form?.title ?? '');
	const isNew = !post.slug;
	let slug = $state(post.slug ?? form?.slug ?? '');
	let categories = $state(post.categories ?? form?.categories ?? '');
	let excerpt = $state(post.excerpt ?? form?.excerpt ?? '');
	let content = $state(post.content ?? form?.content ?? '');
	let published = $state(post.published ?? false);

	let previewHtml = $derived(marked(content || ''));

	// AI review state
	let reviewLevel = $state('minimal');
	let reviewing = $state(false);
	let suggestions = $state([]);
	let reviewError = $state('');
	let levelDropdownOpen = $state(false);

	const levels = {
		minimal: { label: 'Minimal', desc: 'Typos & spelling only' },
		moderate: { label: 'Moderate', desc: 'Typos + grammar' },
		max: { label: 'Max', desc: 'Typos + grammar + phrasing' }
	};

	function getDatePrefix() {
		const now = new Date();
		const yy = String(now.getFullYear()).slice(2);
		const mm = String(now.getMonth() + 1).padStart(2, '0');
		const dd = String(now.getDate()).padStart(2, '0');
		return `${yy}${mm}${dd}`;
	}

	function generateSlug() {
		const base = title
			.toLowerCase()
			.replace(/[^a-z0-9가-힣\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');

		if (isNew) {
			slug = base ? `${getDatePrefix()}-${base}` : getDatePrefix();
		} else {
			slug = base;
		}
	}

	async function runReview() {
		if (!content.trim() || reviewing) return;

		reviewing = true;
		reviewError = '';
		suggestions = [];

		try {
			const res = await fetch('/api/ai/review', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, level: reviewLevel })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || `HTTP ${res.status}`);
			}

			const data = await res.json();
			suggestions = data.suggestions ?? [];
		} catch (err) {
			reviewError = err.message;
		} finally {
			reviewing = false;
		}
	}

	function dismissSuggestion(index) {
		suggestions = suggestions.filter((_, i) => i !== index);
	}

	function dismissAll() {
		suggestions = [];
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

		<!-- GitHub-style tabs + Check button -->
		<div>
			<div class="flex items-center border-b border-white">
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

				<!-- AI Check controls -->
				<div class="ml-auto flex items-center gap-1 pb-1">
					<!-- Level dropdown -->
					<div class="relative">
						<button
							type="button"
							onclick={() => (levelDropdownOpen = !levelDropdownOpen)}
							class="flex items-center gap-1 px-2 py-1 text-xs border border-white/30 hover:border-white/60 transition-colors"
						>
							{levels[reviewLevel].label}
							<ChevronDown size={12} />
						</button>
						{#if levelDropdownOpen}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="absolute right-0 top-full mt-1 z-10 border border-white bg-black min-w-[180px]"
								onmouseleave={() => (levelDropdownOpen = false)}
							>
								{#each Object.entries(levels) as [key, { label, desc }]}
									<button
										type="button"
										onclick={() => {
											reviewLevel = key;
											levelDropdownOpen = false;
										}}
										class="block w-full text-left px-3 py-2 text-xs hover:bg-white/10 {reviewLevel === key
											? 'bg-white/10'
											: ''}"
									>
										<span class="font-bold">{label}</span>
										<span class="opacity-60 ml-1">— {desc}</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Check button -->
					<button
						type="button"
						onclick={runReview}
						disabled={reviewing || !content.trim()}
						class="flex items-center gap-1.5 px-3 py-1 text-xs border border-white/30 hover:border-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
					>
						{#if reviewing}
							<LoaderCircle size={14} class="animate-spin" />
							Checking...
						{:else}
							<SpellCheck size={14} />
							Check
						{/if}
					</button>
				</div>
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

		<!-- AI Suggestions panel -->
		{#if reviewError}
			<div class="border border-red-400/50 bg-red-400/10 px-4 py-3 text-sm">
				<p class="text-red-400">Review failed: {reviewError}</p>
			</div>
		{/if}

		{#if suggestions.length > 0}
			<div class="border border-white/30 bg-white/5">
				<div class="flex items-center justify-between px-4 py-2 border-b border-white/20">
					<span class="text-xs opacity-70">
						{suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} found
					</span>
					<button
						type="button"
						onclick={dismissAll}
						class="text-xs opacity-50 hover:opacity-100 transition-opacity"
					>
						Dismiss all
					</button>
				</div>
				<ul class="divide-y divide-white/10">
					{#each suggestions as { original, suggestion, reason }, i}
						<li class="flex items-start gap-3 px-4 py-3 text-sm">
							<div class="flex-1 min-w-0">
								<div class="font-mono text-xs">
									<span class="line-through opacity-50">{original}</span>
									<span class="mx-1 opacity-30">&rarr;</span>
									<span class="text-green-400">{suggestion}</span>
								</div>
								{#if reason}
									<p class="text-xs opacity-50 mt-1">{reason}</p>
								{/if}
							</div>
							<button
								type="button"
								onclick={() => dismissSuggestion(i)}
								class="opacity-30 hover:opacity-100 transition-opacity shrink-0 mt-0.5"
							>
								<X size={14} />
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

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
