import { Hono } from "hono";
import { validator } from "hono/validator";
import { userSchema, User, loginSchema } from "schema/auth";
import { createNewUser, signInUser } from "../database/users";
import { errorResponse, successResponse } from "../utils/response";

const app = new Hono();

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
    const { email, password } = body;
    try {
      const accessToken = await signInUser(c, { email, password });
      c.header("X-Access-Token", accessToken);
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

export default app;
