import { z } from "zod";

export type ValidationSuccess<T> = {
  data: T;
  error: undefined;
  fieldErrors: undefined;
};
export type ValidationError = {
  data: undefined;
  error: string;
  fieldErrors: Record<string, string[]>;
};
export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

/**
 * Validates an unknown body against a Zod schema.
 * Returns parsed data on success, or a formatted error message on failure.
 */
export function validateBody<T>(
  schema: z.ZodType<T>,
  body: unknown
): ValidationResult<T> {
  const result = schema.safeParse(body);

  if (result.success) {
    return { data: result.data, error: undefined, fieldErrors: undefined };
  }

  // Format field-level errors
  const fieldErrors: Record<string, string[]> = {};
  const messages: string[] = [];

  for (const issue of result.error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "_root";
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
    messages.push(
      issue.path.length > 0
        ? `${issue.path.join(".")}: ${issue.message}`
        : issue.message
    );
  }

  return {
    data: undefined,
    error: messages.join("; "),
    fieldErrors,
  };
}
