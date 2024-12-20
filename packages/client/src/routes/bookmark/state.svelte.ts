import type { ClientBookmark } from 'schema/bookmark';

export const bookmarkState = $state({ bookmarks: [] as ClientBookmark[], nextPageToken: '' });
