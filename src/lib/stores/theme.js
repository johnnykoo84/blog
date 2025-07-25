import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
	const { subscribe, set, update } = writable('light');

	function applyTheme(theme) {
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme);
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}

	function getSystemTheme() {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	return {
		subscribe,
		toggle: () =>
			update((theme) => {
				const newTheme = theme === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('theme', newTheme);
					applyTheme(newTheme);
				}
				return newTheme;
			}),
		init: () => {
			if (browser) {
				const stored = localStorage.getItem('theme');
				const theme = stored || getSystemTheme();
				set(theme);
				applyTheme(theme);

				// Listen for system theme changes when no preference is stored
				const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
				const handleChange = (e) => {
					if (!localStorage.getItem('theme')) {
						const newTheme = e.matches ? 'dark' : 'light';
						set(newTheme);
						applyTheme(newTheme);
					}
				};

				mediaQuery.addEventListener('change', handleChange);

				// Return cleanup function
				return () => mediaQuery.removeEventListener('change', handleChange);
			}
		},
		reset: () => {
			if (browser) {
				localStorage.removeItem('theme');
				const systemTheme = getSystemTheme();
				set(systemTheme);
				applyTheme(systemTheme);
			}
		}
	};
}

export const theme = createThemeStore();
