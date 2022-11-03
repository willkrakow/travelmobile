export function arrayToObject<T extends Record<string, any>>(arr: T[], key: keyof T) {
  const obj: DocumentCache<T> = {};
  arr.forEach((el) => (obj[el[key]] = el));

  return obj;
}
