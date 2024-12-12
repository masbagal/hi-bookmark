import { drizzle } from "drizzle-orm/mysql2";

export interface APIResponse {
  status: "SUCCESS" | "ERROR";
  message: string;
  data: Object;
  code?: number;
}

const db = drizzle(Bun.env.DATABASE_URL as string);

export default db;
