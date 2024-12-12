import { Hono } from "hono";
import { load } from "cheerio";
import bearerAuthMiddleware from "../middleware/auth";
import { addBookmark, getBookmarks } from "../database/bookmarks";
const app = new Hono();

async function getOpenGraphData(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  const result = {
    title: "",
    image: "",
    description: "",
    url,
  };

  // Try to get OG title, fallback to regular title
  result.title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="og:title"]').attr("content") ||
    $("title").text() ||
    "";

  // Try to get OG image
  result.image =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="og:image"]').attr("content") ||
    "";

  result.description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  return result;
}

app.use("/*", bearerAuthMiddleware);

app.post("/add", bearerAuthMiddleware, async (c) => {
  const userContext = c.var.userContext;
  const body = await c.req.json();
  const { url } = body;
  console.log("add ", url);
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

app.get("/get", bearerAuthMiddleware, async (c) => {
  const userContext = c.var.userContext;
  const result = await getBookmarks(userContext.userId);
  return c.json({ bookmark: result, status: "SUCCESS" });
});

app.post("/test", bearerAuthMiddleware, async (c) => {
  return c.json({ success: true, userContext: c.var.userContext });
});

export default app;
