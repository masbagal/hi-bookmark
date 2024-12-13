import { decode, verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import { TokenPayload } from "../utils/authUtils";

const bearerAuthMiddleware = createMiddleware<{
  Variables: {
    userContext: TokenPayload;
  };
}>(async (c, next) => {
  try {
    // Get authorization header
    const auth = c.req.header("Authorization");
    console.log(auth);

    if (!auth) {
      throw new Error("Missing Authorization header");
    }

    // Check if it's a Bearer token
    const [scheme, token] = auth.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new Error("Invalid Authorization format");
    }

    // Validate token
    // Replace this with your actual token validation logic
    const isCorrectToken = await verify(
      token,
      process.env.JWT_SECRET as string
    );

    console.log("token", isCorrectToken);
    if (!isCorrectToken) {
      throw new Error("Invalid token");
    }

    const { payload } = await decode(token);
    c.set("userContext", payload as TokenPayload);
    await next();
  } catch (error) {
    console.log("middleware auth error", error);
    return c.json(
      {
        error: error,
      },
      401
    );
  }
});

export default bearerAuthMiddleware;

// EXPIRED_TOKEN = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFydGhlbiIsImVtYWlsIjoibWFydGhlbkBrYW5naW5hbi5jb20iLCJ1c2VySWQiOjEsImV4cCI6MTczNDAwMDMzMDk5NH0.F66UJizcmOLyIXX5-Di9OzenW_Wjabc927axFVvH-a8
