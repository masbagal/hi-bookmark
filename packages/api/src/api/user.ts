import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { createNewUser, signInUser } from "../database/users";
import { HTTPException } from "hono/http-exception";
const app = new Hono();

app.use(csrf({ origin: "http://localhost:5173" }));
app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173"], // Add your frontend origin or use '*' for development
    credentials: true,
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
  })
);

app.post("/signup", async (c) => {
  const body = await c.req.json();
  console.log("Parsed body:", body);
  const { name, email, password } = body;
  const hashedPassword = await Bun.password.hash(password);
  const result = await createNewUser({ name, email, password: hashedPassword });
  console.log(result);
  return c.json(result);
});

app.post("/signin", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;
  const result = await signInUser(c, { email, password });
  return c.json(result);
});

export default app;
