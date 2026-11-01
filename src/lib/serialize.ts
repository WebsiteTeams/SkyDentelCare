/** Converts a lean Mongoose result (ObjectIds, Dates) into a plain object safe to pass to client components. */
export function serialize<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
