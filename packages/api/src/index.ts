import { Hono } from "hono";
import { cors } from "hono/cors";
import userRoute from "./api/user";
import bookmarkRoute from "./api/bookmark";
import bearerAuthMiddleware from "./middleware/auth";

const app = new Hono();

app.use("/*", cors());
app.use(
  "/*",
  cors({
    origin: "http:/localhost:5173",
    allowMethods: ["POST", "GET", "OPTIONS"],
    maxAge: 600,
    credentials: true,
  })
);
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/user", userRoute);
app.route("/bookmark", bookmarkRoute);

export default {
  port: 4000,
  fetch: app.fetch,
};
