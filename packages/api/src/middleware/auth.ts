import { eq } from "drizzle-orm";
import { decode, verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { sessionTable } from "../database/schema";

import {
  generateJWTToken,
  getRefreshTokenExpiry,
  TokenPayload,
} from "../utils/authUtils";
import db from "../database/db";
import { ACCESS_TOKEN_HEADER_KEY } from "schema/constants";

/**
 * Middleware to check bearer token
 * and regenerate one if current token is expired
 */
const bearerAuthMiddleware = createMiddleware<{
  Variables: {
    userContext: TokenPayload;
  };
}>(async (c, next) => {
  // Get authorization header
  const auth = c.req.header("Authorization");
  if (!auth) {
    throw new Error("Missing Authorization header");
  }
  try {
    // Check if it's a Bearer token
    const [scheme, token] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new Error("Invalid Authorization format");
    }

    // Validate token
    const isCorrectToken = await verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (!isCorrectToken) {
      throw new Error("Invalid token");
    }

    const tokenObject = decode(token).payload as TokenPayload;

    // Check in session database if it exists
    const sessionCheck = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.id, tokenObject.sessionId));

    console.log("session rows", sessionCheck, tokenObject);

    c.set("userContext", tokenObject);
    await next();
  } catch (error) {
    // If error caused by expired token, generate a new one and extend the session
    if (error instanceof JwtTokenExpired) {
      const [, token] = auth.split(" ");
      const decodedToken = decode(token).payload as TokenPayload;
      const sessionId = decodedToken.sessionId;

      const refreshTokenExpiry = getRefreshTokenExpiry();

      // extend session expiration time in database
      await db
        .update(sessionTable)
        .set({
          expires_at: BigInt(refreshTokenExpiry),
        })
        .where(eq(sessionTable.id, sessionId));

      const { token: newToken, decodedToken: newTokenObject } =
        await generateJWTToken(sessionId, {
          name: decodedToken.name,
          email: decodedToken.email,
          id: decodedToken.userId!,
        });

      c.header(ACCESS_TOKEN_HEADER_KEY, newToken);
      c.set("userContext", newTokenObject);
      await next();
    } else {
      console.log("middleware auth error", error);
      return c.json(
        {
          error: error,
        },
        401
      );
    }
  }
});

export default bearerAuthMiddleware;

// EXPIRED_TOKEN = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFydGhlbiIsImVtYWlsIjoibWFydGhlbkBrYW5naW5hbi5jb20iLCJ1c2VySWQiOjEsImV4cCI6MTczNDAwMDMzMDk5NH0.F66UJizcmOLyIXX5-Di9OzenW_Wjabc927axFVvH-a8
