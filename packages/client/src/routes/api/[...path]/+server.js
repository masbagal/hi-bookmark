import { json } from '@sveltejs/kit';
import { COOKIE_ACCESS_TOKEN } from '$lib/constants';
import { NODE_ENV } from '$env/static/private';
import { ACCESS_TOKEN_HEADER_KEY } from 'schema/constants';
import serverFetch from '$lib/fetcher/fetch.js';

export const POST = async ({ request, cookies, params }) => {
	const payload = await request.json();
	const accessToken = cookies.get(COOKIE_ACCESS_TOKEN);
	const result = await serverFetch(`/${params.path}`, payload, accessToken);
	const response = await result.json();

	const token = result.headers.get(ACCESS_TOKEN_HEADER_KEY) ?? '';
	if (result.headers.has(ACCESS_TOKEN_HEADER_KEY)) {
		cookies.set(COOKIE_ACCESS_TOKEN, token, {
			path: '/',
			httpOnly: true,
			secure: NODE_ENV === 'production' ? true : false,
			sameSite: 'strict'
		});
	}

	return json(response);
};
