export function extractFieldNames(results: { [key: string]: string }[]) {
  return Object.keys(results[0]).map((field) => ({ field }));
}
