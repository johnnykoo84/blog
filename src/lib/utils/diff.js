import { diffLines } from 'diff';

/**
 * Compute a line-level diff between two texts.
 * @returns {Array<{ type: 'added'|'removed'|'unchanged', lines: string[] }>}
 */
export function computeDiff(oldText, newText) {
	const changes = diffLines(oldText, newText);
	return changes.map((part) => ({
		type: part.added ? 'added' : part.removed ? 'removed' : 'unchanged',
		lines: part.value.replace(/\n$/, '').split('\n')
	}));
}

/**
 * Collapse long unchanged sections into { type: 'collapsed', count } markers,
 * keeping `contextLines` of context around each change.
 */
export function collapseDiff(chunks, contextLines = 3) {
	const result = [];

	for (const chunk of chunks) {
		if (chunk.type !== 'unchanged' || chunk.lines.length <= contextLines * 2 + 1) {
			result.push(chunk);
			continue;
		}

		const top = chunk.lines.slice(0, contextLines);
		const bottom = chunk.lines.slice(-contextLines);
		const hiddenCount = chunk.lines.length - contextLines * 2;

		result.push({ type: 'unchanged', lines: top });
		result.push({ type: 'collapsed', count: hiddenCount });
		result.push({ type: 'unchanged', lines: bottom });
	}

	return result;
}
