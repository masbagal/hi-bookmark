import { eq, desc, getTableColumns, lt, and } from "drizzle-orm";
import db, { APIResponse } from "./db";
import { bookmarkTable } from "./schema";

const PAGE_SIZE = 5;

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
  const { user_id, ...fields } = getTableColumns(bookmarkTable);
  const result = await db
    .select({ ...fields })
    .from(bookmarkTable)
    .where(eq(bookmarkTable.user_id, userId))
    .orderBy(desc(bookmarkTable.created_at))
    .limit(PAGE_SIZE + 1);
  const hasNextPage = result.length > PAGE_SIZE;
  return { rows: result.slice(0, PAGE_SIZE), hasNextPage };
}

export async function getBookmarkNextPagination(
  userId: number,
  dateCursor: Date
) {
  const { user_id, ...fields } = getTableColumns(bookmarkTable);
  const result = await db
    .select({ ...fields })
    .from(bookmarkTable)
    .where(
      and(
        eq(bookmarkTable.user_id, userId),
        lt(bookmarkTable.created_at, dateCursor)
      )
    )
    .orderBy(desc(bookmarkTable.created_at))
    .limit(PAGE_SIZE + 1);
  const hasNextPage = result.length > PAGE_SIZE;
  return { rows: result.slice(0, PAGE_SIZE), hasNextPage };
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
