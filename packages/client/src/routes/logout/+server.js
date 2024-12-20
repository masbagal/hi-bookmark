import { COOKIE_ACCESS_TOKEN } from '$lib/constants.js';
import { NODE_ENV } from '$env/static/private';
import serverFetch from '$lib/fetcher/fetch.js';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	await serverFetch('/user/signout', {}, cookies.get(COOKIE_ACCESS_TOKEN));
	cookies.delete(COOKIE_ACCESS_TOKEN, {
		path: '/',
		httpOnly: true,
		secure: NODE_ENV === 'production' ? true : false,
		sameSite: 'strict'
	});
	return redirect(303, '/login');
};
