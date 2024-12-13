import { Hono } from "hono";
import { createNewUser, signInUser } from "../database/users";
const app = new Hono();

app.post("/signup", async (c) => {
  const body = await c.req.json();
  console.log("Parsed body:", body);
  const { name, email, password } = body;
  const hashedPassword = await Bun.password.hash(password);
  const result = await createNewUser({ name, email, password: hashedPassword });
  return c.json(result);
});

app.post("/signin", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;
  const result = await signInUser(c, { email, password });
  return c.json(result);
});

export default app;
