import { HttpError } from "../errors.js";
import type { UsersResponse } from "../types.js";

export async function fetchUsers(
  baseUrl: string,
  count: number,
  fetchImpl: typeof fetch = fetch
): Promise<UsersResponse> {
  const url = new URL(baseUrl);
  url.searchParams.set("results", String(count));
  let response: Response;
  try {
    response = await fetchImpl(url);
  } catch {
    throw new HttpError(502, "Unable to reach the user data provider", "UPSTREAM_UNAVAILABLE");
  }
  if (!response.ok) {
    throw new HttpError(502, "User data provider returned an error", "UPSTREAM_ERROR");
  }
  try {
    return (await response.json()) as UsersResponse;
  } catch {
    throw new HttpError(502, "User data provider returned invalid JSON", "UPSTREAM_INVALID_RESPONSE");
  }
}
