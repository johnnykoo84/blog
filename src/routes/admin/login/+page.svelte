<script>
	let { form } = $props();
</script>

<div class="flex items-center justify-center min-h-screen px-4">
	<div class="w-full max-w-sm border border-white p-6">
		<h1 class="text-lg font-bold mb-6 text-center">[ ADMIN LOGIN ]</h1>

		{#if form?.error}
			<p class="text-red-400 text-sm mb-4 text-center">{form.error}</p>
		{/if}

		<form method="POST" class="space-y-4">
			<div>
				<label for="email" class="block text-sm mb-1">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					value={form?.email ?? ''}
					required
					class="w-full bg-transparent border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white/10"
				/>
			</div>
			<div>
				<label for="password" class="block text-sm mb-1">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="w-full bg-transparent border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:bg-white/10"
				/>
			</div>
			<button type="submit" class="btn w-full">LOGIN</button>
		</form>
	</div>
</div>
