import { error } from '@sveltejs/kit';

export const prerender = false;

// Allows client side routing. Necessary for page transitions and link prefetching; change to false if you prefer ordinary routing without JS
export const csr = true;

export const load = async ({ url }) => {
	try {
		return {
			path: url.pathname
		};
	} catch (err) {
		error(500, err);
	}
};
