<script>
	import { clientFetch, protectedGet } from '$lib/clientFetch';
	import { onMount } from 'svelte';

	const { form } = $props();
	// @ts-ignore
	let bookmarks = $state([]);

	// @ts-ignore
	const handleAddNewBookmark = async (e) => {
		e.preventDefault();
		const inputElm = e.currentTarget.urlInput;
		const url = inputElm.value;
		const response = await clientFetch('/bookmark/add', { url });
		const result = await response.json();
		if (result.status === 'SUCCESS') {
			bookmarks.unshift(result.data);
			inputElm.focus();
			inputElm.value = '';
		}
	};

	/**
	 * @param {string} bookmarkId
	 */
	const handleDeleteBookmark = (bookmarkId) => async () => {
		const response = await clientFetch('/bookmark/delete', { bookmarkId });
		const result = await response.json();
		if (result.status === 'SUCCESS') {
			bookmarks = bookmarks.filter((bookmark) => bookmark.id !== result.result.data.deletedId);
		}
	};

	onMount(async () => {
		const result = await clientFetch('/bookmark/get', {});
		const response = await result.json();
		bookmarks = response.bookmark;
	});
</script>

<div>{JSON.stringify(form)}</div>

<h1>Test page for bookmark</h1>
<form method="post" onsubmit={handleAddNewBookmark}>
	<input type="text" name="urlInput" />
	<button>Submit</button>
</form>

<h2>Bookmarks</h2>
{#each bookmarks as bookmark}
	<div class="flex w-full flex-col items-center space-x-16 p-8 shadow-sm sm:flex-row">
		<img class="h-24 w-full object-cover sm:w-24" src={bookmark.image} alt={bookmark.title} />
		<div>
			<h4 class="text-lg font-bold"><a href={bookmark.url}>{bookmark.title}</a></h4>
			<p>{bookmark.description}</p>
		</div>
		<button onclick={handleDeleteBookmark(bookmark.id)}>Delete</button>
	</div>
{/each}
