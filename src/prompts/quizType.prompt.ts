// quiztype.prompt.ts
interface Context {
  cefr: string;
  grammarPoint: string;
  vocabWords: string;
  storyText: string;
  unitName: string;
}

export function getMCQPrompt(ctx: Context): string {
  return `You are an advanced CEFR-based English quiz generator.

Use the following context to generate exactly ONE multiple-choice question.

Theme (Unit Name): ${ctx.unitName}
CEFR Level: ${ctx.cefr}
Story: ${ctx.storyText}
Vocabulary List: ${ctx.vocabWords}
Grammar Point: ${ctx.grammarPoint}
Quiz Type: Multiple Choice (MCQ)

Return JSON only:
{
  "question": "...",
  "choices": ["...", "...", "...", "..."],
  "answer": "...",
  "explanation": "...",
  "mode": "TEXT_TO_TEXT"
}`.trim();
}

export function getSentenceOrderPrompt(ctx: Context): string {
  return `You are an advanced CEFR-based English quiz generator.

Use the following context to generate ONE sentence reordering quiz.

Theme (Unit Name): ${ctx.unitName}
CEFR Level: ${ctx.cefr}
Story: ${ctx.storyText}
Vocabulary List: ${ctx.vocabWords}
Grammar Point: ${ctx.grammarPoint}
Quiz Type: Sentence Order

Return JSON only:
{
  "question": "Arrange the parts of the sentence in correct order.",
  "choices": ["to", "go", "I", "school"],
  "answer": "I go to school",
  "explanation": "Correct order of a basic sentence",
  "mode": "REORDER_SENTENCES"
}`.trim();
}

export function getMatchingPrompt(ctx: Context): string {
  return `You are an advanced CEFR-based English quiz generator.

Use the following context to create a matching quiz that pairs vocabulary to their definitions.

Theme (Unit Name): ${ctx.unitName}
CEFR Level: ${ctx.cefr}
Story: ${ctx.storyText}
Vocabulary List: ${ctx.vocabWords}
Grammar Point: ${ctx.grammarPoint}
Quiz Type: Matching (word -> definition)

Return JSON only:
{
  "question": "Match the words to their definitions.",
  "choices": [
    { "left": "dog", "right": "a friendly animal" },
    { "left": "book", "right": "a thing you read" }
  ],
  "answer": { "dog": "a friendly animal", "book": "a thing you read" },
  "explanation": "Each word matches its correct definition",
  "mode": "MATCH_TEXT_TEXT"
}`.trim();
}
