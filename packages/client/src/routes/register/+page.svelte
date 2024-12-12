<script>
	import { enhance } from '$app/forms';

	const { data, form } = $props();
</script>

<form method="post" action="?/submit" use:enhance>
	<div>
		<label for="Name">name</label>
		<input type="text" required name="name" />
	</div>
	<div>
		<label for="email">Email</label>
		<input type="email" required name="email" />
	</div>
	<div>
		<label for="password">Password</label>
		<input type="password" required name="password" />
	</div>
	<button>Register</button>
</form>
