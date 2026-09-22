import express, { type ErrorRequestHandler } from "express";
import { z } from "zod";
import { config } from "./config.js";
import { HttpError } from "./errors.js";
import { applyFilter } from "./filter.js";
import { genderUsers, parseFilter, summarizeUsers } from "./services/llm.js";
import { fetchUsers } from "./services/random-user.js";

export const app = express();
app.use(express.json({ limit: "16kb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/users", async (_req, res, next) => {
  try {
    res.json(await fetchUsers(config.randomUserUrl, 50));
  } catch (error) { next(error); }
});

app.get("/users/gender", async (_req, res, next) => {
  try {
    const users = await fetchUsers(config.randomUserUrl, 100);
    res.json(await genderUsers(users));
  } catch (error) { next(error); }
});

app.get("/users/summary", async (_req, res, next) => {
  try {
    const users = await fetchUsers(config.randomUserUrl, 100);
    res.json({ summary: await summarizeUsers(users) });
  } catch (error) { next(error); }
});

app.post("/users/filter", async (req, res, next) => {
  try {
    const { query } = z.object({ query: z.string().trim().min(1).max(500) }).parse(req.body);
    const users = await fetchUsers(config.randomUserUrl, 300);
    const filter = await parseFilter(query);
    res.json({ users: applyFilter(users.results, filter) });
  } catch (error) { next(error); }
});

app.use(((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Invalid request", code: "VALIDATION_ERROR", details: error.issues });
    return;
  }
  const httpError = error instanceof HttpError ? error : new HttpError(500, "Internal server error", "INTERNAL_ERROR");
  if (httpError.statusCode >= 500 && !(error instanceof HttpError)) console.error(error);
  res.status(httpError.statusCode).json({ error: httpError.message, code: httpError.code });
}) satisfies ErrorRequestHandler);
