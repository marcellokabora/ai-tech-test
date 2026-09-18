import { config } from "../config.js";
import { HttpError } from "../errors.js";
import type { UserFilter, UsersResponse } from "../types.js";

const filterSchemaDescription = `Return JSON only, exactly one of:
{"field":"age","operator":"gt"|"lt","value":number}
{"field":"age","operator":"between","min":number,"max":number}
{"field":"city","operator":"eq","value":"city name"}`;

async function complete(system: string, user: string): Promise<string> {
  if (!config.llmApiKey) {
    throw new HttpError(503, "LLM provider is not configured", "LLM_NOT_CONFIGURED");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.llmTimeoutMs);
  try {
    const response = await fetch(`${config.llmBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.llmApiKey}`
      },
      body: JSON.stringify({
        model: config.llmModel,
        temperature: 0,
        messages: [{ role: "system", content: system }, { role: "user", content: user }]
      }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error("provider error");
    const body = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = body.choices?.[0]?.message?.content;
    if (!content) throw new Error("empty response");
    return content;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(502, "LLM provider request failed", "LLM_PROVIDER_ERROR");
  } finally {
    clearTimeout(timeout);
  }
}

const parseJson = <T>(content: string): T => {
  const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new HttpError(502, "LLM returned an invalid structured response", "LLM_INVALID_RESPONSE");
  }
};

export async function summarizeUsers(data: UsersResponse): Promise<string> {
  return complete(
    "You summarize datasets accurately. Respond with one concise natural-language paragraph.",
    `Summarize this random-user dataset, mentioning count and useful demographic patterns. Dataset JSON:\n${JSON.stringify(data)}`
  );
}

export async function parseFilter(query: string): Promise<UserFilter> {
  const parsed = parseJson<UserFilter>(await complete(
    `Convert the user's request into a structured filter. Do not return users or prose. ${filterSchemaDescription}`,
    query
  ));
  if (parsed.field === "age" && (parsed.operator === "gt" || parsed.operator === "lt") &&
      Number.isInteger(parsed.value) && parsed.value >= 0 && parsed.value <= 120) return parsed;
  if (parsed.field === "age" && parsed.operator === "between" &&
      Number.isInteger(parsed.min) && Number.isInteger(parsed.max) &&
      parsed.min >= 0 && parsed.max <= 120 && parsed.min <= parsed.max) return parsed;
  if (parsed.field === "city" && parsed.operator === "eq" &&
      typeof parsed.value === "string" && parsed.value.trim().length > 0 && parsed.value.length <= 100) {
    return { ...parsed, value: parsed.value.trim() };
  }
  throw new HttpError(422, "The query could not be converted to a supported filter", "UNSUPPORTED_FILTER");
}
