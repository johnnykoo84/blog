/**
 * All of these values are used throughout the site – for example,
 * in the <meta> tags, in the footer, and in the RSS feed.
 *
 * PLEASE BE SURE TO UPDATE THEM ALL! Thank you!
 **/

export const siteTitle = 'bloKoo';
export const siteDescription = '나의 생각을 정리하여 기록하는 공간';
export const siteURL = 'blog.ilmokoo.com';
export const siteLink = 'https://blog-six-opal-20.vercel.app';
export const siteAuthor = 'Ilmo Koo';

// Controls how many posts are shown per page on the main blog index pages
export const postsPerPage = 10;

// Edit this to alter the main nav menu. (Also used by the footer and mobile nav.)
export const navItems = [
	{
		title: 'Blog',
		route: '/'
	},
	{
		title: 'About',
		route: '/about'
	}
];
