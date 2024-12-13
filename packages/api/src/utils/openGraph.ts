import { load } from "cheerio";

export async function getOpenGraphData(url: string) {
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
