import { Hono } from "hono";
import { validator } from "hono/validator";
import { userSchema, User, loginSchema } from "schema/auth";
import { ACCESS_TOKEN_HEADER_KEY } from "schema/constants";
import { createNewUser, signInUser, signOutUser } from "../database/users";
import { errorResponse, successResponse } from "../utils/response";
import { TokenPayload } from "../utils/authUtils";
import { verify } from "hono/jwt";
import bearerAuthMiddleware from "../middleware/auth";

type Variables = {
  userContext: TokenPayload;
};
const app = new Hono<{ Variables: Variables }>();

app.post(
  "/signup",
  validator("json", (value, c) => {
    const parsed = userSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        errorResponse<User>(value, "There was an error with your inputs"),
        406
      );
    }
    return parsed.data;
  }),
  async (c) => {
    const body = await c.req.json();
    const { name, email, password } = body;
    const hashedPassword = await Bun.password.hash(password);
    try {
      const result = await createNewUser({
        name,
        email,
        password: hashedPassword,
      });
      return c.json(successResponse<Omit<User, "password">>(result));
    } catch (error) {
      console.error("Error in /signup", error);
      return c.json(
        errorResponse<User>(body, "There was an error registering this user"),
        406
      );
    }
  }
);

app.post(
  "/signin",
  validator("json", (value, c) => {
    const parsed = loginSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        errorResponse<User>(value, "There was an error with your inputs"),
        401
      );
    }
    return parsed.data;
  }),
  async (c) => {
    const body = await c.req.json();
    try {
      const { token: accessToken, decodedToken } = await signInUser(body);
      c.header(ACCESS_TOKEN_HEADER_KEY, accessToken);
      c.set("userContext", decodedToken as TokenPayload);
      return c.json(successResponse(body));
    } catch (error) {
      let errorMessage = "Failed to log you in";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error in /signin", error);
      return c.json(errorResponse(body, errorMessage), 401);
    }
  }
);

app.post("/signout", bearerAuthMiddleware, async (c) => {
  const { sessionId } = c.var.userContext;
  const result = await signOutUser(sessionId);
  c.header(ACCESS_TOKEN_HEADER_KEY, "");
  return c.json(successResponse(result));
});

app.post("/whoami", async (c) => {
  const auth = c.req.header("Authorization");
  if (auth) {
    try {
      const [, token] = auth.split(" ");
      const decodedToken = (await verify(
        token,
        process.env.JWT_SECRET as string
      )) as TokenPayload;
      return c.json({
        isLoggedIn: true,
        name: decodedToken.name,
        email: decodedToken.email,
      });
    } catch (error) {
      return c.json({ isLoggedIn: false });
    }
  } else {
    return c.json({ isLoggedIn: false });
  }
});

export default app;
