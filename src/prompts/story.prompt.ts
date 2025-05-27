// src/prompts/story.prompt.ts

export interface StoryPromptContext {
  unitName: string;
  cefrLevel: string;
  vocabWords: string;
}

export interface GenerateStoryOptions {
  theme?: string;
  length?: 'short' | 'medium' | 'long';
}

/**
 * Build the OpenAI prompt for generating a CEFR-aligned story
 */
export function getGenerateStoryPrompt(
  ctx: StoryPromptContext,
  options: GenerateStoryOptions,
): string {
  const { unitName, cefrLevel, vocabWords } = ctx;
  const length = options.length || 'medium';
  const themePart = options.theme
    ? `Theme: ${options.theme}.
`
    : '';

  return `You are an expert CEFR-aligned writer.
Generate a ${length}-length story for unit "${unitName}" at CEFR level ${cefrLevel}.
The story should incorporate these vocabulary words: ${vocabWords}.
${themePart}Return JSON with keys: title, content, keywords (comma-separated).

Example output:
{
  "title": "A Day at the Market",
  "content": "Maria woke up early to visit the bustling market. She greeted the vendor and practiced her new vocabulary...",
  "keywords": "market, vendor, bargain, fresh, crowd"
}`;
}
