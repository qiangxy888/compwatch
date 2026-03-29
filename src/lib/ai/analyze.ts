import Anthropic from '@anthropic-ai/sdk';
import { diffWords } from 'diff';

export interface ChangeAnalysis {
  summary: string;        // 2-3 sentence summary
  category: 'pricing' | 'feature' | 'content' | 'seo' | 'design' | 'other';
  importance: 'critical' | 'important' | 'medium' | 'minor';
  insight: string;        // Business insight / what it means
  changes: string[];      // Bullet points of specific changes
}

// Pre-process diff to filter out noise
function preprocessDiff(oldText: string, newText: string): string {
  const changes = diffWords(oldText, newText);
  const meaningful: string[] = [];

  for (const part of changes) {
    if (!part.added && !part.removed) continue;

    const text = part.value.trim();
    // Skip very short changes (likely whitespace/formatting)
    if (text.length < 5) continue;
    // Skip timestamp-like patterns
    if (/^\d{4}[-/]\d{2}[-/]\d{2}/.test(text)) continue;
    // Skip pure numbers (counters, dates)
    if (/^\d+$/.test(text)) continue;

    const prefix = part.added ? '[ADDED]' : '[REMOVED]';
    meaningful.push(`${prefix} ${text}`);
  }

  return meaningful.join('\n');
}

const SYSTEM_PROMPT = `You are a competitive intelligence analyst. You analyze changes on competitor websites and provide actionable insights.

Given the diff of a webpage, you must:
1. Summarize what changed in 2-3 clear sentences
2. Categorize the change (pricing/feature/content/seo/design/other)
3. Rate importance (critical/important/medium/minor)
4. Provide a business insight — what does this change mean strategically?
5. List specific changes as bullet points

Respond in valid JSON format only:
{
  "summary": "...",
  "category": "pricing|feature|content|seo|design|other",
  "importance": "critical|important|medium|minor",
  "insight": "...",
  "changes": ["...", "..."]
}

Rules:
- Be specific: "Pricing changed from $29 to $39" not "Pricing was updated"
- Be actionable: Tell the user what this means for their business
- Category "pricing" = any pricing/plan/tier changes
- Category "feature" = new features, removed features, product updates
- Category "content" = blog posts, case studies, testimonials, copy changes
- Category "seo" = title/meta/heading/URL changes
- Category "design" = layout/visual changes (usually "minor")
- If changes are trivial (only whitespace, timestamps, counters), set importance to "minor"`;

export async function analyzeChange(
  url: string,
  oldText: string,
  newText: string,
): Promise<ChangeAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Return a basic analysis without AI
    return {
      summary: `Changes detected on ${new URL(url).hostname}. AI analysis requires API key.`,
      category: 'other',
      importance: 'medium',
      insight: 'Configure ANTHROPIC_API_KEY for AI-powered analysis.',
      changes: ['Content has been modified'],
    };
  }

  const diff = preprocessDiff(oldText, newText);

  if (diff.length < 10) {
    return {
      summary: 'Minor changes detected (likely formatting or timestamps).',
      category: 'other',
      importance: 'minor',
      insight: 'No significant content changes.',
      changes: ['Minor text formatting changes'],
    };
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `URL: ${url}\n\nChanges detected:\n${diff.slice(0, 4000)}`,
    }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';

  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]) as ChangeAnalysis;
  } catch {
    return {
      summary: text.slice(0, 200),
      category: 'other',
      importance: 'medium',
      insight: 'AI analysis completed but response parsing failed.',
      changes: ['See summary for details'],
    };
  }
}
