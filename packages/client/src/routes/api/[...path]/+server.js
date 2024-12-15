import { json } from '@sveltejs/kit';
import { API_ENDPOINT } from '$env/static/private';
import { COOKIE_ACCESS_TOKEN } from '$lib/constants';

export const POST = async ({ request, cookies, params }) => {
	const payload = await request.json();
	const accessToken = cookies.get(COOKIE_ACCESS_TOKEN);
	const apiUrl = `${API_ENDPOINT}/${params.path}`;
	const result = await fetch(apiUrl, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});

	const response = await result.json();
	return json(response);
};
