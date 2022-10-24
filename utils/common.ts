export const isNil = (item?: unknown) => typeof item === "undefined" || item === null;

export const mapToString = (arr: number[]) => arr.map(a => a.toString())

export const mapToNum = (arr: string[]) => arr.map(a => parseInt(a, 10));