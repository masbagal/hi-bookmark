import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { COOKIE_ACCESS_TOKEN } from '$lib/constants.js';

export const actions = {
	add: async ({ request, cookies }) => {
		const data = await request.formData();
		const payload = {
			url: data.get('url')
		};

		const accessToken = cookies.get(COOKIE_ACCESS_TOKEN);

		const result = await fetch(`${PUBLIC_API_ENDPOINT}/bookmark/add}`, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await result.json();
	}
};
