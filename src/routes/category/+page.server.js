import { fetchDbPosts } from '$lib/server/fetchDbPosts.js';

export const load = async () => {
	let posts = [];
	try {
		posts = await fetchDbPosts();
	} catch {
		// DB not available
	}

	let uniqueCategories = {};

	posts.forEach((post) => {
		(post.categories || []).forEach((category) => {
			if (uniqueCategories.hasOwnProperty(category)) {
				uniqueCategories[category].count += 1;
			} else {
				uniqueCategories[category] = {
					title: category,
					count: 1
				};
			}
		});
	});

	const sortedUniqueCategories = Object.values(uniqueCategories).sort((a, b) => a.title > b.title);

	return {
		uniqueCategories: sortedUniqueCategories
	};
};
