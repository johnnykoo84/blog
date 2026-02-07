<script>
	import { marked } from 'marked';
	import { SpellCheck, X, LoaderCircle, ChevronDown, Check } from '@lucide/svelte';

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

	// Textarea ref for scroll-to-text
	let textareaEl = $state(null);

	const levels = {
		minimal: { label: 'Minimal', desc: 'Typos & spelling only' },
		moderate: { label: 'Moderate', desc: 'Typos + grammar + natural expression' },
		max: { label: 'Max', desc: 'Full editorial: structure + content + style' }
	};

	const STRUCTURAL_TAGS = ['[구조]', '[추가]', '[삭제 권장]'];

	function isStructural(suggestion) {
		return STRUCTURAL_TAGS.some((tag) => suggestion.startsWith(tag));
	}

	function getTagLabel(suggestion) {
		const tag = STRUCTURAL_TAGS.find((t) => suggestion.startsWith(t));
		return tag || null;
	}

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
			suggestions = (data.suggestions ?? []).map((s) => ({ ...s, stale: false }));
		} catch (err) {
			reviewError = err.message;
		} finally {
			reviewing = false;
		}
	}

	function applySuggestion(index) {
		const s = suggestions[index];
		const idx = content.indexOf(s.original);
		if (idx === -1) {
			// Mark as stale — original text not found
			suggestions = suggestions.map((item, i) => (i === index ? { ...item, stale: true } : item));
			return;
		}
		content = content.substring(0, idx) + s.suggestion + content.substring(idx + s.original.length);
		suggestions = suggestions.filter((_, i) => i !== index);
	}

	function applyAll() {
		// Filter to auto-applicable suggestions (non-structural, non-stale)
		const applicable = suggestions
			.map((s, i) => ({ ...s, index: i }))
			.filter((s) => !s.stale && !isStructural(s.suggestion));

		// Find positions and sort last-first to avoid offset shifts
		const withPositions = applicable
			.map((s) => ({ ...s, pos: content.indexOf(s.original) }))
			.filter((s) => s.pos !== -1)
			.sort((a, b) => b.pos - a.pos);

		// Apply in reverse order
		for (const s of withPositions) {
			content = content.substring(0, s.pos) + s.suggestion + content.substring(s.pos + s.original.length);
		}

		// Remove applied suggestions, mark not-found as stale
		const appliedIndices = new Set(withPositions.map((s) => s.index));
		suggestions = suggestions
			.map((s, i) => {
				if (appliedIndices.has(i)) return null;
				if (!s.stale && !isStructural(s.suggestion) && content.indexOf(s.original) === -1) {
					return { ...s, stale: true };
				}
				return s;
			})
			.filter(Boolean);
	}

	function scrollToOriginal(original) {
		if (activeTab !== 'write' || !textareaEl) return;
		const idx = content.indexOf(original);
		if (idx === -1) return;

		textareaEl.focus();
		textareaEl.setSelectionRange(idx, idx + original.length);

		// Estimate scroll position by line count
		const textBefore = content.substring(0, idx);
		const linesBefore = textBefore.split('\n').length;
		const lineHeight = 20; // approximate px per line in monospace
		const scrollTarget = Math.max(0, linesBefore * lineHeight - textareaEl.clientHeight / 2);
		textareaEl.scrollTop = scrollTarget;
	}

	function dismissSuggestion(index) {
		suggestions = suggestions.filter((_, i) => i !== index);
	}

	function dismissAll() {
		suggestions = [];
	}

	let applicableCount = $derived(
		suggestions.filter((s) => !s.stale && !isStructural(s.suggestion)).length
	);
</script>

<div class="{suggestions.length > 0 ? 'max-w-6xl' : 'max-w-4xl'} mx-auto px-4 py-8">
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

					<!-- Check button with count badge -->
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
							{#if suggestions.length > 0}
								<span class="ml-1 px-1.5 py-0.5 text-[10px] leading-none bg-yellow-400/20 text-yellow-400 border border-yellow-400/40">
									{suggestions.length}
								</span>
							{/if}
						{/if}
					</button>
				</div>
			</div>

			<!-- Editor + Suggestions layout -->
			<div class="grid {suggestions.length > 0 ? 'grid-cols-1 md:grid-cols-[1fr_320px]' : 'grid-cols-1'} gap-4">
				<!-- Left: Editor/Preview -->
				<div>
					{#if activeTab === 'write'}
						<textarea
							id="content"
							name="content"
							bind:value={content}
							bind:this={textareaEl}
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

				<!-- Right: Suggestions sidebar -->
				{#if suggestions.length > 0}
					<div class="border border-white/30 bg-white/5 md:sticky md:top-4 md:self-start md:max-h-[calc(100vh-8rem)] md:overflow-y-auto">
						<div class="flex items-center justify-between px-3 py-2 border-b border-white/20">
							<span class="text-xs opacity-70">
								{suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
							</span>
							<div class="flex items-center gap-2">
								{#if applicableCount > 0}
									<button
										type="button"
										onclick={applyAll}
										class="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
									>
										<Check size={12} />
										Apply all
									</button>
								{/if}
								<button
									type="button"
									onclick={dismissAll}
									class="text-xs opacity-50 hover:opacity-100 transition-opacity"
								>
									Dismiss all
								</button>
							</div>
						</div>
						<ul class="divide-y divide-white/10">
							{#each suggestions as s, i}
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li
									class="px-3 py-3 text-sm {s.stale ? 'opacity-40' : 'hover:bg-white/5'}"
									onmouseenter={() => !s.stale && scrollToOriginal(s.original)}
								>
									<div class="flex items-start gap-2">
										<div class="flex-1 min-w-0">
											{#if s.stale}
												<p class="text-xs text-yellow-400/70 mb-1">Text not found</p>
											{/if}

											{#if getTagLabel(s.suggestion)}
												<span class="inline-block px-1.5 py-0.5 text-[10px] leading-none mb-1.5
													{getTagLabel(s.suggestion) === '[구조]' ? 'bg-blue-400/20 text-blue-400 border border-blue-400/40' : ''}
													{getTagLabel(s.suggestion) === '[추가]' ? 'bg-purple-400/20 text-purple-400 border border-purple-400/40' : ''}
													{getTagLabel(s.suggestion) === '[삭제 권장]' ? 'bg-red-400/20 text-red-400 border border-red-400/40' : ''}
												">{getTagLabel(s.suggestion)}</span>
											{/if}

											<div class="font-mono text-xs break-words">
												<span class="line-through opacity-50">{s.original}</span>
												<span class="mx-1 opacity-30">&rarr;</span>
												{#if getTagLabel(s.suggestion)}
													<span class="text-yellow-300">{s.suggestion.substring(getTagLabel(s.suggestion).length).trim()}</span>
												{:else}
													<span class="text-green-400">{s.suggestion}</span>
												{/if}
											</div>
											{#if s.reason}
												<p class="text-xs opacity-50 mt-1">{s.reason}</p>
											{/if}
										</div>
										<div class="flex flex-col gap-1 shrink-0 mt-0.5">
											{#if !s.stale && !isStructural(s.suggestion)}
												<button
													type="button"
													onclick={() => applySuggestion(i)}
													class="opacity-40 hover:opacity-100 hover:text-green-400 transition-all"
													title="Apply this fix"
												>
													<Check size={14} />
												</button>
											{/if}
											<button
												type="button"
												onclick={() => dismissSuggestion(i)}
												class="opacity-30 hover:opacity-100 transition-opacity"
												title="Dismiss"
											>
												<X size={14} />
											</button>
										</div>
									</div>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>

		<!-- AI error message -->
		{#if reviewError}
			<div class="border border-red-400/50 bg-red-400/10 px-4 py-3 text-sm">
				<p class="text-red-400">Review failed: {reviewError}</p>
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
