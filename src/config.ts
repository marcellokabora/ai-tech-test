import "dotenv/config";

const positiveInteger = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const config = {
  port: positiveInteger(process.env.PORT, 3000),
  randomUserUrl: process.env.RANDOM_USER_URL ?? "https://randomuser.me/api/",
  llmApiKey: process.env.LLM_API_KEY,
  llmBaseUrl: (process.env.LLM_BASE_URL ?? "https://openrouter.ai/api/v1").replace(/\/$/, ""),
  llmModel: process.env.LLM_MODEL ?? "google/gemini-2.0-flash-exp:free",
  llmTimeoutMs: positiveInteger(process.env.LLM_TIMEOUT_MS, 15000)
};
