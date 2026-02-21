import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const SYSTEM_BASE = `You are an editor for a Korean blog. Respect the author's voice and personal writing style.

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

Do NOT rewrite sentences. Do NOT touch grammar, style, phrasing, or word choice.`,

	moderate: `Focus on:
- Typos and spelling errors (맞춤법)
- Broken or awkward grammar (문법)
- Unnatural phrasing or translated-sounding expressions (부자연스러운 표현)
- Sentences that could flow more smoothly

Scope: sentence-level fixes. Do NOT restructure paragraphs or add new content.`,

	max: `You are doing a full editorial review. Focus on:
- Typos, spelling, grammar (맞춤법, 문법)
- Unnatural phrasing and sentence flow
- Content additions — suggest new sentences or paragraphs that would strengthen the post. Prefix "suggestion" with [추가].
- Structural improvements — reorder sections, add subheadings, break up long paragraphs. Prefix "suggestion" with [구조].
- Weak sections that could be removed. Prefix "suggestion" with [삭제 권장].
- Stronger openings and closings

For structural suggestions ([구조], [추가], [삭제 권장]):
- "original" should be the relevant passage from the text
- "suggestion" should start with the tag, e.g. "[구조] 이 섹션을 두 단락으로 나누세요"
- These are advisory — they describe what to change rather than providing replacement text

Be thorough and give actionable feedback. The author wants real editorial help, not gentle nudges.`
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
			model: 'claude-sonnet-4-6',
			max_tokens: level === 'max' ? 4096 : 2048,
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
