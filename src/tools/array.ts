const isNotEmptyArray = (data: unknown): data is Array<unknown> =>
  Array.isArray(data) && !!data.length;

export { isNotEmptyArray };
