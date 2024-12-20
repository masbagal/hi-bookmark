<script lang="ts">
	import { clientFetch } from '$lib/fetcher/clientFetch';
	import { bookmarkState } from './state.svelte';

	const handleDeleteBookmark = (bookmarkId: number) => async () => {
		const response = await clientFetch('/bookmark/delete', { bookmarkId });
		const result = await response.json();
		if (result.status === 'SUCCESS') {
			bookmarkState.bookmarks = bookmarkState.bookmarks.filter(
				(bookmark) => bookmark.id !== result.result.data.deletedId
			);
		}
	};

	const handleLoadNextPage = async () => {
		const response = await clientFetch('/bookmark/next-page', {
			nextPageToken: bookmarkState.nextPageToken
		});
		const result = await response.json();
		if (result.status === 'SUCCESS') {
			bookmarkState.bookmarks = bookmarkState.bookmarks.concat(result.bookmarks);
			bookmarkState.nextPageToken = result.nextPageToken;
			bookmarkState.hasNextPage = Boolean(result.nextPageToken);
		}
	};
</script>

<h2>Bookmarks</h2>
{#each bookmarkState.bookmarks as bookmark}
	<div class="flex w-full flex-col items-center space-x-16 p-8 shadow-sm sm:flex-row">
		<img class="h-24 w-full object-cover sm:w-24" src={bookmark.image} alt={bookmark.title} />
		<div>
			<h4 class="text-lg font-bold"><a href={bookmark.url}>{bookmark.title}</a></h4>
			<p>{bookmark.description}</p>
		</div>
		<button onclick={handleDeleteBookmark(bookmark.id)}>Delete</button>
	</div>
{/each}

{#if bookmarkState.hasNextPage}
	<button onclick={handleLoadNextPage}>Load next page</button>
{/if}
