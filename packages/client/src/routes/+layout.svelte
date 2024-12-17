<script>
	import '../app.css';
	let { children } = $props();
</script>

<nav>
	<a href="/bookmark">Bookmark</a>
	<a href="/login">Login</a>
	<a href="/register">Register</a>
</nav>
{@render children()}
