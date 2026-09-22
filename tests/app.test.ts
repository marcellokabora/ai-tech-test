import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import * as randomUser from "../src/services/random-user.js";
import * as llm from "../src/services/llm.js";

afterEach(() => vi.restoreAllMocks());

describe("API", () => {
  it("returns the upstream response for users", async () => {
    vi.spyOn(randomUser, "fetchUsers").mockResolvedValue({ results: [{ id: 1 }] });
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ results: [{ id: 1 }] });
  });
  it("returns an LLM summary", async () => {
    vi.spyOn(randomUser, "fetchUsers").mockResolvedValue({ results: [] });
    vi.spyOn(llm, "summarizeUsers").mockResolvedValue("A concise summary.");
    const response = await request(app).get("/users/summary");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ summary: "A concise summary." });
  });
  it("groups users by gender", async () => {
    vi.spyOn(randomUser, "fetchUsers").mockResolvedValue({
      results: [{ gender: "male", id: 1 }, { gender: "female", id: 2 }, { gender: "male", id: 3 }]
    });
    const response = await request(app).get("/users/gender");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      male: [{ gender: "male", id: 1 }, { gender: "male", id: 3 }],
      female: [{ gender: "female", id: 2 }]
    });
  });
  it("validates filter input", async () => {
    const response = await request(app).post("/users/filter").send({ query: "" });
    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
  });
  it("interprets a query and applies the resulting filter in the backend", async () => {
    vi.spyOn(randomUser, "fetchUsers").mockResolvedValue({
      results: [
        { dob: { age: 41 }, location: { city: "London" } },
        { dob: { age: 25 }, location: { city: "London" } }
      ]
    });
    vi.spyOn(llm, "parseFilter").mockResolvedValue({ field: "age", operator: "gt", value: 40 });
    const response = await request(app).post("/users/filter").send({ query: "Users older than 40" });
    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(1);
    expect(response.body.users[0].dob.age).toBe(41);
  });
});
