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

		/* Set refresh token in the httponly cookie */
		const setCookieHeader = result.headers.get('set-cookie');
		if (setCookieHeader) {
			setCookieHeader.split(',').forEach((cookie) => {
				const [cookieName, cookieValue] = cookie.split(';')[0].split('=');
				cookies.set(cookieName, cookieValue, {
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
					maxAge: 60 * 10
				});
			});
		}

		const returnedResponse = await result.json();
		return returnedResponse;
	}
};
