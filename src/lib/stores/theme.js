import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { themes } from '$lib/themes.js';

function createThemeStore() {
	const { subscribe, set } = writable('hitel');

	function apply(themeId) {
		const palette = themes[themeId];
		if (!palette || !browser) return;

		const el = document.documentElement;
		for (const [key, value] of Object.entries(palette.vars)) {
			el.style.setProperty(`--${key}`, value);
		}
		set(themeId);
	}

	return {
		subscribe,
		apply,
		init: async () => {
			if (!browser) return;
			try {
				const res = await fetch('/api/theme');
				if (res.ok) {
					const { theme: themeId } = await res.json();
					if (themeId && themeId !== 'hitel') {
						apply(themeId);
					} else {
						set('hitel');
					}
				}
			} catch {
				// Fallback: HiTel is already the CSS default
				set('hitel');
			}
		}
	};
}

export const theme = createThemeStore();
