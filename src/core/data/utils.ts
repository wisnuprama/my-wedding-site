export function deserializeSheetData<
  T extends Record<string, any>,
  R extends Record<keyof T, any>,
>(raw: T): R {
  const entries = Object.entries(raw) as [keyof T, T[keyof T]][];

  const deserialized: Partial<R> = {};

  for (const [key, value] of entries) {
    let parsedValue: any = value;

    if (!isNaN(Number(parsedValue))) {
      parsedValue = Number(parsedValue);
    } else if (value === "TRUE" || value === "FALSE") {
      parsedValue = value === "TRUE";
    }

    deserialized[key] = parsedValue;
  }

  return deserialized as R;
}

export function serializeSheetData<
  I extends Record<string, any>,
  T extends Record<keyof I, string>,
>(raw: I): T {
  const entries = Object.entries(raw) as [keyof I, I[keyof I]][];

  const deserialized: Partial<T> = {};

  for (const [key, value] of entries) {
    let parsedValue: string;

    if (typeof value === "boolean") {
      parsedValue = (value ? "TRUE" : "FALSE") as "TRUE" | "FALSE";
    } else {
      parsedValue = String(value);
    }

    // @ts-expect-error
    deserialized[key] = parsedValue;
  }

  return deserialized as T;
}
