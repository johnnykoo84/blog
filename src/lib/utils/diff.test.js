import { describe, it, expect } from 'vitest';
import { computeDiff, collapseDiff } from './diff.js';

describe('computeDiff', () => {
	it('returns unchanged for identical texts', () => {
		const result = computeDiff('hello\nworld', 'hello\nworld');
		expect(result).toEqual([{ type: 'unchanged', lines: ['hello', 'world'] }]);
	});

	it('detects added lines', () => {
		const result = computeDiff('line1', 'line1\nline2');
		const added = result.filter((c) => c.type === 'added');
		expect(added.length).toBeGreaterThan(0);
		expect(added.some((c) => c.lines.includes('line2'))).toBe(true);
	});

	it('detects removed lines', () => {
		const result = computeDiff('line1\nline2', 'line1');
		const removed = result.filter((c) => c.type === 'removed');
		expect(removed.length).toBeGreaterThan(0);
		expect(removed.some((c) => c.lines.includes('line2'))).toBe(true);
	});

	it('handles empty strings', () => {
		const result = computeDiff('', '');
		expect(result).toEqual([]);
	});

	it('handles completely different texts', () => {
		const result = computeDiff('aaa', 'bbb');
		const types = result.map((c) => c.type);
		expect(types).toContain('added');
		expect(types).toContain('removed');
	});

	it('handles multiline changes', () => {
		const old = 'line1\nline2\nline3';
		const updated = 'line1\nmodified\nline3';
		const result = computeDiff(old, updated);
		expect(result.length).toBeGreaterThan(1);
	});
});

describe('collapseDiff', () => {
	it('does not collapse short unchanged sections', () => {
		const chunks = [{ type: 'unchanged', lines: ['a', 'b', 'c'] }];
		const result = collapseDiff(chunks, 3);
		expect(result).toEqual(chunks);
	});

	it('collapses long unchanged sections', () => {
		const lines = Array.from({ length: 20 }, (_, i) => `line${i}`);
		const chunks = [{ type: 'unchanged', lines }];
		const result = collapseDiff(chunks, 3);

		expect(result.length).toBe(3);
		expect(result[0]).toEqual({ type: 'unchanged', lines: ['line0', 'line1', 'line2'] });
		expect(result[1]).toEqual({ type: 'collapsed', count: 14 });
		expect(result[2]).toEqual({ type: 'unchanged', lines: ['line17', 'line18', 'line19'] });
	});

	it('preserves non-unchanged chunks as-is', () => {
		const chunks = [
			{ type: 'added', lines: ['new line'] },
			{ type: 'removed', lines: ['old line'] }
		];
		const result = collapseDiff(chunks, 3);
		expect(result).toEqual(chunks);
	});

	it('uses custom contextLines', () => {
		const lines = Array.from({ length: 20 }, (_, i) => `line${i}`);
		const chunks = [{ type: 'unchanged', lines }];
		const result = collapseDiff(chunks, 5);

		expect(result[0].lines.length).toBe(5);
		expect(result[2].lines.length).toBe(5);
		expect(result[1].count).toBe(10);
	});

	it('does not collapse when lines equal threshold', () => {
		// contextLines=3, threshold = 3*2+1 = 7. 7 lines should NOT be collapsed
		const lines = Array.from({ length: 7 }, (_, i) => `line${i}`);
		const chunks = [{ type: 'unchanged', lines }];
		const result = collapseDiff(chunks, 3);
		expect(result).toEqual(chunks);
	});

	it('collapses when lines exceed threshold by one', () => {
		// 8 lines > 7 threshold, should collapse
		const lines = Array.from({ length: 8 }, (_, i) => `line${i}`);
		const chunks = [{ type: 'unchanged', lines }];
		const result = collapseDiff(chunks, 3);
		expect(result.length).toBe(3);
		expect(result[1]).toEqual({ type: 'collapsed', count: 2 });
	});

	it('handles mixed chunks with long unchanged in between', () => {
		const longUnchanged = Array.from({ length: 15 }, (_, i) => `unchanged${i}`);
		const chunks = [
			{ type: 'removed', lines: ['old'] },
			{ type: 'unchanged', lines: longUnchanged },
			{ type: 'added', lines: ['new'] }
		];
		const result = collapseDiff(chunks, 3);

		expect(result.length).toBe(5);
		expect(result[0]).toEqual({ type: 'removed', lines: ['old'] });
		expect(result[1].type).toBe('unchanged');
		expect(result[2].type).toBe('collapsed');
		expect(result[3].type).toBe('unchanged');
		expect(result[4]).toEqual({ type: 'added', lines: ['new'] });
	});
});
