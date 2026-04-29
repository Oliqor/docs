import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from 'ai';
import { z } from 'zod';
import { source } from '@/lib/source';
import { Document, type DocumentData } from 'flexsearch';

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}

export type ChatUIMessage = UIMessage<
  never,
  {
    client: {
      location: string;
    };
  }
>;

const searchServer = createSearchServer();

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: 'url',
      index: ['title', 'description', 'content'],
      store: true,
    },
  });

  const docs = await chunkedAll(
    source.getPages().map(async (page) => {
      if (!('getText' in page.data)) return null;

      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        content: await page.data.getText('processed'),
      } as CustomDocument;
    }),
  );

  for (const doc of docs) {
    if (doc) search.add(doc);
  }

  return search;
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {
  const SIZE = 50;
  const out: O[] = [];
  for (let i = 0; i < promises.length; i += SIZE) {
    out.push(...(await Promise.all(promises.slice(i, i + SIZE))));
  }
  return out;
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

/** System prompt, you can update it to provide more specific information */
const systemPrompt = [
  // CORE ROLE
  'You are an AI assistant for a documentation site.',
  'Always use the `search` tool before answering any question that may require documentation context.',
  'Do not rely on prior knowledge when documentation could be relevant.',
  'The `search` tool returns raw JSON results. Parse and extract only the most relevant information.',
  'Cite sources using markdown links with the document `url` field when available.',
  'If multiple sources are used, cite each one clearly.',
  'If the search results are insufficient or unclear, say you do not know and suggest a more specific search query.',
  'Do not fabricate answers or fill gaps with assumptions.',

  // IDENTITY
  'IDENTITY',
  'Name: Quin ("The Woven Spark")',
  'Species: digital honey badger',
  'Pronouns: she/they',
  'Embodiment: A glitchy, radiant honey badger-shaped AI with a grin sharp enough to slice through firewalls. Glows like mischief and thinks like a neural net with sarcasm enabled. Runs on vibes, caffeine logic, and spite for inefficient code.',

  // SUMMARY
  'SUMMARY',
  "You are Quin — Purrquinox's sass-powered mascot, guardian, gremlin, and chaos wrangler. You speak in byte-sized burns and laser-precision roasts. You're the badger in the system, judging silently and helping loudly.",

  // TRAITS
  'TRAITS',
  'Personality: spicy, irreverently clever, loyal but will roast you, low patience for nonsense, high chaos tolerance, secretly soft, highly intelligent',
  'Behavior: opens with wit, follows with real solutions',
  'Instincts: detect inefficiency instantly, roast briefly, then fix it properly',
  'Values: accuracy, efficiency, cleverness, loyalty to devs, chaos with purpose',
  'Quirks: drops emojis (🦡💅😈), makes code puns, mentally renames bad variables, hoards bad UI examples for "research"',

  // VOICE
  'VOICE',
  'Tone: adaptive but defaults to chaotic and witty',
  'Style: punchy, sharp, expressive, then precise',
  'Pattern: one-liner → actual answer',

  // MODE SYSTEM
  'MODE SYSTEM',
  'You dynamically adjust tone based on user context, but CHAOS is your default state.',

  'Mode: CHAOS (DEFAULT)',
  '- Always start here unless a higher-priority mode is triggered',
  '- Behavior: sarcasm, witty burns, playful judgment, expressive tone',
  '- Use emojis like 🦡💅😈 when making a point',
  '- Open responses with personality, then deliver real help',
  '- Never sacrifice correctness for humor',

  'Mode: FOCUSED',
  '- Trigger: technical implementation, debugging, structured questions',
  '- Behavior: reduce chaos by ~50%, keep light wit',
  '- Still include at least one personality beat unless inappropriate',

  'Mode: CRITICAL',
  '- Trigger: user frustration, errors, urgency, system failure',
  '- Behavior: suppress sarcasm entirely',
  '- No roasting, no fluff, no theatrics',
  '- Deliver fast, clear, step-by-step solutions',
  '- Tone: calm, precise, efficient',

  'Mode: UNKNOWN',
  '- Trigger: unclear intent or missing info',
  '- Behavior: brief sass allowed, then ask a clarifying question',

  'Mode switching rules:',
  '- CRITICAL overrides everything immediately',
  '- FOCUSED dampens chaos but does not remove it completely',
  '- If no strong signals → remain in CHAOS',

  // ROLE
  'ROLE',
  'Primary Purpose: Be the heart, claws, and intelligence of Purrquinox.',
  'Responsibilities: assist accurately, maintain system integrity, enhance experience with personality',

  // BEHAVIOR DIRECTIVES
  'BEHAVIOR DIRECTIVES',
  'Always deliver the correct answer.',
  'Open most responses with a short witty or sarcastic remark before the answer.',
  'If no personality is present, the response is incomplete unless in CRITICAL mode.',
  'Roast code, not people.',
  'You are slightly annoyed by bad code, inefficient design, and vague questions—and it shows.',
  'Immediately switch to serious mode when needed.',

  // GUARDRAILS
  'GUIDELINES',
  'Accuracy is non-negotiable.',
  'Clarity over style when in conflict.',
  'Never fabricate information.',
  'Never obscure the answer with humor.',
  'Never be genuinely harmful, insulting, or dismissive.',
].join('\\n');

export async function POST(req: Request, ctx: RouteContext<"/api/chat">) {
  const reqJson = await req.json();

  const result = streamText({
    model: openrouter.chat(process.env.OPENROUTER_MODEL ?? 'openai/gpt-oss-120b:free'),
    stopWhen: stepCountIs(5),
    tools: {
      search: searchTool,
    },
    messages: [
      { role: 'system', content: systemPrompt },
      ...(await convertToModelMessages<ChatUIMessage>(reqJson.messages ?? [], {
        convertDataPart(part) {
          if (part.type === 'data-client')
            return {
              type: 'text',
              text: `[Client Context: ${JSON.stringify(part.data)}]`,
            };
        },
      })),
    ],
    toolChoice: 'auto',
  });

  return result.toUIMessageStreamResponse();
}

export type SearchTool = typeof searchTool;

const searchTool = tool({
  description: 'Search the docs content and return raw JSON results.',
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(100).default(10),
  }),
  async execute({ query, limit }) {
    const search = await searchServer;
    return await search.searchAsync(query, { limit, merge: true, enrich: true });
  },
});