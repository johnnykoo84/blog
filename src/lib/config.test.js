import { describe, it, expect } from 'vitest';
import {
	siteTitle,
	siteDescription,
	siteURL,
	siteLink,
	siteAuthor,
	postsPerPage,
	navItems
} from './config.js';

describe('config', () => {
	it('exports siteTitle as a non-empty string', () => {
		expect(typeof siteTitle).toBe('string');
		expect(siteTitle.length).toBeGreaterThan(0);
	});

	it('exports siteDescription as a non-empty string', () => {
		expect(typeof siteDescription).toBe('string');
		expect(siteDescription.length).toBeGreaterThan(0);
	});

	it('exports siteURL without protocol', () => {
		expect(siteURL).not.toMatch(/^https?:\/\//);
	});

	it('exports siteLink with https protocol', () => {
		expect(siteLink).toMatch(/^https:\/\//);
	});

	it('siteLink contains siteURL', () => {
		expect(siteLink).toContain(siteURL);
	});

	it('exports siteAuthor as a non-empty string', () => {
		expect(typeof siteAuthor).toBe('string');
		expect(siteAuthor.length).toBeGreaterThan(0);
	});

	it('exports postsPerPage as a positive integer', () => {
		expect(Number.isInteger(postsPerPage)).toBe(true);
		expect(postsPerPage).toBeGreaterThan(0);
	});

	it('exports navItems as a non-empty array', () => {
		expect(Array.isArray(navItems)).toBe(true);
		expect(navItems.length).toBeGreaterThan(0);
	});

	it('each navItem has title and route', () => {
		navItems.forEach((item) => {
			expect(item).toHaveProperty('title');
			expect(item).toHaveProperty('route');
			expect(typeof item.title).toBe('string');
			expect(typeof item.route).toBe('string');
			expect(item.route).toMatch(/^\//);
		});
	});
});
