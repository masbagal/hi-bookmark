import { Hono } from "hono";

import bearerAuthMiddleware from "../middleware/auth";
import {
  addBookmark,
  deleteBookmark,
  getBookmarks,
} from "../database/bookmarks";
import { getOpenGraphData } from "../utils/openGraph";

const app = new Hono();

app.post("/add", bearerAuthMiddleware, async (c) => {
  const userContext = c.var.userContext;
  const body = await c.req.json();
  const { url } = body;
  console.log("add ", url, userContext);
  try {
    const metadata = await getOpenGraphData(url);
    const result = await addBookmark({
      description: metadata.description,
      image: metadata.image,
      title: metadata.title,
      user_id: userContext.userId,
      url,
    });

    console.log(result);
    return c.json(result);
  } catch (error) {
    console.log(error);
    return c.json({ success: false });
  }
});

app.post("/get", bearerAuthMiddleware, async (c) => {
  const userContext = c.var.userContext;
  const result = await getBookmarks(userContext.userId);
  return c.json({ bookmark: result, status: "SUCCESS" });
});

app.post("/delete", bearerAuthMiddleware, async (c) => {
  const body = await c.req.json();
  const result = await deleteBookmark(body.bookmarkId);
  return c.json({ result, status: "SUCCESS" });
});

app.post("/test", bearerAuthMiddleware, async (c) => {
  return c.json({ success: true, userContext: c.var.userContext });
});

export default app;
