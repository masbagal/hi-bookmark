<script>
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { TOKEN_STORAGE_KEY } from '$lib/constants.js';
	const { form } = $props();

	let loading = $state(false);
</script>

<div>
	{JSON.stringify(form)}
</div>

<form
	method="post"
	action="?/submit"
	use:enhance={() => {
		loading = true;
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const data = result.data?.data;
				const token = data['token'];
				if (token) {
					localStorage.setItem(TOKEN_STORAGE_KEY, token);
				}
			}
			loading = false;
		};
	}}
>
	<div>
		<label for="email">Email</label>
		<input disabled={loading} type="email" name="email" />
	</div>
	<div>
		<label for="password">Password</label>
		<input disabled={loading} type="password" name="password" />
	</div>
	<button disabled={loading}>Login</button>
</form>
