<script lang="ts">
	import { clientFetch } from '$lib/fetcher/clientFetch';
	import { onMount } from 'svelte';
	import BookmarkList from './bookmarkList.svelte';
	import { bookmarkState } from './state.svelte.js';

	const { form } = $props();

	const handleAddNewBookmark = async (e: SubmitEvent) => {
		e.preventDefault();
		const inputElm = (e.currentTarget as HTMLFormElement)?.urlInput;
		const url = inputElm.value;
		const response = await clientFetch('/bookmark/add', { url });
		const result = await response.json();
		if (result.status === 'SUCCESS') {
			bookmarkState.bookmarks.unshift(result.data);
			inputElm.focus();
			inputElm.value = '';
		}
	};

	onMount(async () => {
		const result = await clientFetch('/bookmark/get', {});
		const response = await result.json();
		bookmarkState.bookmarks = response.bookmark;
	});
</script>

<div>{JSON.stringify(form)}</div>

<h1>Test page for bookmark</h1>
<form method="post" onsubmit={handleAddNewBookmark}>
	<input type="text" name="urlInput" />
	<button>Submit</button>
</form>

<BookmarkList />
