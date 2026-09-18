export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown error";
