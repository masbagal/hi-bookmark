import { Hono } from "hono";

import bearerAuthMiddleware from "../middleware/auth";
import {
  addBookmark,
  deleteBookmark,
  getBookmarkNextPagination,
  getBookmarks,
} from "../database/bookmarks";
import { getOpenGraphData } from "../utils/openGraph";
import {
  createNextPageToken,
  getLastCreatedDateFromToken,
} from "../utils/bookmarkUtils";
import {
  NextBookmarkPaginationPayload,
  type ClientBookmark,
} from "schema/bookmark";
import { validator } from "hono/validator";
import { errorResponse } from "../utils/response";

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
  const lastEntry = result[result.length - 1];
  const nextPageToken = await createNextPageToken(lastEntry.created_at);
  return c.json({ bookmark: result, nextPageToken, status: "SUCCESS" });
});

app.post(
  "/next-page",
  bearerAuthMiddleware,
  validator("json", (value, c) => {
    const parsed = NextBookmarkPaginationPayload.safeParse(value);
    if (!parsed.success) {
      return c.json(
        errorResponse({}, "There was an error with your inputs"),
        500
      );
    }
  }),
  async (c) => {
    const body = await c.req.json();
    const userContext = c.var.userContext;
    const { nextPageToken } = body;

    const dateCursor = getLastCreatedDateFromToken(nextPageToken);
    const result = await getBookmarkNextPagination(
      userContext.userId,
      dateCursor
    );
    const lastEntry = result[result.length - 1];
    const newNextPageToken = await createNextPageToken(lastEntry.created_at);
    return c.json({
      bookmarks: result,
      nextPageToken: newNextPageToken,
      status: "SUCCESS",
    });
  }
);

app.post("/delete", bearerAuthMiddleware, async (c) => {
  const body = await c.req.json();
  const result = await deleteBookmark(body.bookmarkId);
  return c.json({ result, status: "SUCCESS" });
});

app.post("/test", bearerAuthMiddleware, async (c) => {
  return c.json({ success: true, userContext: c.var.userContext });
});

export default app;
