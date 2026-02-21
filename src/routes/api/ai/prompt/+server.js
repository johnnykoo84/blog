import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const HUMANIZE_RULES = `
WRITING STYLE — sound human, not AI-generated:
- Vary sentence length. Mix short punchy sentences with longer ones. Don't make every sentence the same rhythm.
- NEVER use em dashes (—). Use commas, periods, or parentheses instead.
- AVOID these AI-giveaway words/phrases: "delve", "landscape", "realm", "crucial", "moreover", "furthermore", "in today's world", "it's worth noting", "game-changer", "dive into", "navigate", "leverage", "elevate", "foster", "holistic", "robust", "seamless", "cutting-edge", "at its core", "plays a vital role", "in conclusion".
- Don't start multiple paragraphs with the same structure.
- Skip promotional/hype language. Be direct and honest, including about downsides.
- Don't use the "rule of three" pattern (listing exactly 3 things) repeatedly.
- Avoid starting sentences with "This" referring to the previous sentence's concept.
- No inflated symbolism or forced deeper meaning. Say what you mean plainly.
- Use contractions naturally (건 → 거, 것은 → 건, etc. in Korean; don't → do not in English).
- It's OK to be informal, use incomplete sentences, or break grammar rules for voice.
- Prefer concrete examples over abstract statements.`;

const EDIT_SYSTEM = `You are a writing assistant for a Korean blog. The user will provide their blog post content and an editing instruction.

Apply the instruction to the content and return the FULL modified markdown.
${HUMANIZE_RULES}

IMPORTANT:
- Return ONLY the modified markdown content, no explanation, no markdown fences.
- Preserve the author's voice and style unless the instruction says otherwise.
- If the instruction is unclear, make your best interpretation and apply it.
- Always return the complete post, not just the changed parts.`;

const GENERATE_SYSTEM = `You are a writing assistant for a Korean blog. The user will provide a topic or instruction for a new blog post.

Write a blog post in markdown format based on the instruction.
${HUMANIZE_RULES}

IMPORTANT:
- Return ONLY the markdown content, no explanation, no markdown fences.
- Write in a natural, personal blog voice. Sound like a real person writing on their blog, not a corporate article.
- Use appropriate markdown formatting (headings, lists, emphasis).
- Default to Korean unless the instruction specifies otherwise.`;

export async function POST({ request, cookies }) {
	const sessionId = cookies.get('session_id');
	const session = await validateSession(sessionId);
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { content, prompt, title } = await request.json();

	if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
		return json({ error: 'Prompt is required' }, { status: 400 });
	}

	const mode = content && content.trim() ? 'edit' : 'generate';
	const system = mode === 'edit' ? EDIT_SYSTEM : GENERATE_SYSTEM;

	const userMessage =
		mode === 'edit'
			? `## Blog post${title ? ` — "${title}"` : ''}\n\n${content}\n\n## Instruction\n\n${prompt}`
			: `${title ? `Blog title: "${title}"\n\n` : ''}${prompt}`;

	try {
		const message = await client.messages.create({
			model: 'claude-sonnet-4-6',
			max_tokens: 8192,
			system,
			messages: [{ role: 'user', content: userMessage }]
		});

		const result = message.content[0].text;

		return json({ result });
	} catch (err) {
		console.error('AI prompt error:', err);
		return json({ error: 'AI prompt failed' }, { status: 500 });
	}
}
