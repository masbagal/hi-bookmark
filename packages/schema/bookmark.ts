import { z } from "zod";

export const AddBookmarkPayload = z.object({
  url: z.string().url({ message: "Invalid url" }),
});

export const DeleteBookmarkPayload = z.object({
  bookmarkId: z.number(),
});

export const NextBookmarkPaginationPayload = z.object({
  nextPageToken: z.string(),
});

export type ClientBookmark = {
  id: number;
  url: string;
  created_at: string;
  title: string;
  description: string;
  image: string;
};
