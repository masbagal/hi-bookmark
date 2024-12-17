import { Hono } from "hono";
import { cors } from "hono/cors";
import { ACCESS_TOKEN_HEADER_KEY } from "schema/constants";
import userRoute from "./routes/user";
import bookmarkRoute from "./routes/bookmark";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173"], // Add your frontend origin or use '*' for development
    credentials: true,
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    exposeHeaders: ["Content-Length", ACCESS_TOKEN_HEADER_KEY],
    maxAge: 600,
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
