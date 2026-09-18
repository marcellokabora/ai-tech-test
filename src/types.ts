export interface RandomUser {
  name?: { title?: string; first?: string; last?: string };
  location?: { city?: string; country?: string };
  dob?: { age?: number };
  [key: string]: unknown;
}

export interface UsersResponse {
  results: RandomUser[];
  info?: Record<string, unknown>;
  [key: string]: unknown;
}

export type UserFilter =
  | { field: "age"; operator: "gt" | "lt"; value: number }
  | { field: "age"; operator: "between"; min: number; max: number }
  | { field: "city"; operator: "eq"; value: string };
