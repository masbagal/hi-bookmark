<script>
	import '../app.css';
	let { children, data } = $props();
</script>

<nav>
	<a href="/bookmark">Bookmark</a>
	<a href="/login">Login</a>
	<a href="/register">Register</a>
	{#if data.userContext.isLoggedIn}
		<a href="/logout">Log out</a>
	{/if}
</nav>

<div>{JSON.stringify(data)}</div>
{@render children()}
