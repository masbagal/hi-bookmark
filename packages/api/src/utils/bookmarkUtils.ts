import { sign, decode } from "hono/jwt";

export async function createNextPageToken(date: Date | null) {
  if (date === null) return "";
  return await sign({ date }, Bun.env.JWT_SECRET as string);
}

export function getLastCreatedDateFromToken(token: string) {
  const tokenObject = decode(token).payload as { date: number };
  return new Date(tokenObject.date);
}
