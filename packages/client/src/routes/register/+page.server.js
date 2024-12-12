export const actions = {
	submit: async ({ request }) => {
		const data = await request.formData();

		const payload = {
			name: data.get('name'),
			email: data.get('email'),
			password: data.get('password')
		};

		const result = await fetch('http://localhost:4000/user/signup', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		return await result.json();
	}
};
