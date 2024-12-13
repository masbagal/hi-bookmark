export const actions = {
	submit: async ({ request, cookies }) => {
		const data = await request.formData();

		const payload = {
			email: data.get('email'),
			password: data.get('password')
		};

		const result = await fetch('http://localhost:4000/user/signin', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		console.log('xxx', result.headers);
		const token = result.headers.get('X-Access-Token');
		const returnedResponse = await result.json();
		return { ...returnedResponse, token };
	}
};
