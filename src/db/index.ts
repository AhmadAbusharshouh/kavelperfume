import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDb(d1?: any) {
  if (d1) {
    return drizzle(d1, { schema });
  }
  return null;
}

export * from "./schema";
