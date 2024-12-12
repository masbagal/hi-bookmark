import { decode, verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import { TokenPayload } from "../database/users";

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

    if (!isCorrectToken) {
      throw new Error("Invalid token");
    }

    const { payload } = await decode(token);
    c.set("userContext", payload as TokenPayload);
    await next();
  } catch (error) {
    return c.json(
      {
        error: error,
      },
      401
    );
  }
});

export default bearerAuthMiddleware;
