import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const SYSTEM_BASE = `You are a proofreader for a Korean blog. Respect the author's voice and personal writing style. Do not rewrite sentences — only flag clear errors.

Return a JSON array of objects with this exact shape:
[{ "original": "the erroneous text", "suggestion": "the corrected text", "reason": "brief explanation in Korean" }]

If there is nothing to fix, return an empty array: []

IMPORTANT:
- Return ONLY the JSON array, no markdown fences, no extra text.
- "original" must be an exact substring from the input text.
- Keep "reason" to one short sentence in Korean.`;

const LEVEL_INSTRUCTIONS = {
	minimal: `Focus ONLY on:
- Typos and spelling errors (맞춤법)
- Clearly wrong characters or missing spaces

Do NOT touch grammar, style, phrasing, or word choice.`,

	moderate: `Focus on:
- Typos and spelling errors (맞춤법)
- Clearly broken or awkward grammar (문법)
- Unclear sentences that are hard to parse

Do NOT suggest rewording for style or tone.`,

	max: `Focus on:
- Typos and spelling errors (맞춤법)
- Grammar fixes (문법)
- Suggest better phrases or expressions where clearly improvable

Still respect the author's voice — suggest improvements, don't rewrite.`
};

export async function POST({ request, cookies }) {
	const sessionId = cookies.get('session_id');
	const session = await validateSession(sessionId);
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { content, level = 'minimal' } = await request.json();

	if (!content || typeof content !== 'string') {
		return json({ error: 'Content is required' }, { status: 400 });
	}

	const levelInstruction = LEVEL_INSTRUCTIONS[level] || LEVEL_INSTRUCTIONS.minimal;

	try {
		const message = await client.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 2048,
			system: `${SYSTEM_BASE}\n\n${levelInstruction}`,
			messages: [
				{
					role: 'user',
					content: `Please review the following blog post text and return your suggestions as a JSON array:\n\n${content}`
				}
			]
		});

		const text = message.content[0].text.trim();
		const suggestions = JSON.parse(text);

		return json({ suggestions });
	} catch (err) {
		console.error('AI review error:', err);
		return json({ error: 'AI review failed' }, { status: 500 });
	}
}
