import { sign } from "hono/jwt";
import { User } from "../database/users";

export function generateSessionId() {
  return crypto.randomUUID();
}

export type TokenPayload = {
  name: string;
  email: string;
  userId: number;
  sessionId: string;
  exp: number;
};

export async function generateJWTToken(sessionId: string, userEntry: User) {
  const jwtTokenExpiry = Math.floor(Date.now() / 1000) + 60 * 15; // Token expires in 5 minutes
  const payload: TokenPayload = {
    name: userEntry.name,
    email: userEntry.email,
    userId: userEntry.id,
    sessionId,
    exp: jwtTokenExpiry,
  };

  const token = await sign(payload, Bun.env.JWT_SECRET as string);
  return token as string;
}
