import { eq } from "drizzle-orm";
import db, { APIResponse } from "./db";
import { bookmarkTable } from "./schema";

type Bookmark = {
  id?: number;
  user_id: number;
  url: string;
  created_at?: number;
  title: string;
  description: string;
  image: string;
};

export async function addBookmark(bookmark: Bookmark) {
  await db.insert(bookmarkTable).values({
    user_id: bookmark.user_id,
    title: bookmark.title,
    description: bookmark.description,
    url: bookmark.url,
    image: bookmark.image,
  });
  return {
    status: "SUCCESS",
    message: "Bookmark added",
    data: {
      ...bookmark,
    },
  } as APIResponse;
}

export async function getBookmarks(userId: number) {
  const result = await db
    .select()
    .from(bookmarkTable)
    .where(eq(bookmarkTable.user_id, userId));
  return result;
}

export async function deleteBookmark(bookmarkId: number) {
  await db.delete(bookmarkTable).where(eq(bookmarkTable.id, bookmarkId));
  return {
    status: "SUCCESS",
    message: "Bookmark deleted",
    data: {
      deletedId: bookmarkId,
    },
  } as APIResponse;
}
