import { COOKIE_ACCESS_TOKEN } from '$lib/constants.js';
import serverFetch from '$lib/fetch.js';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	await serverFetch('/user/signout', {}, cookies.get(COOKIE_ACCESS_TOKEN));
	cookies.delete(COOKIE_ACCESS_TOKEN, { path: '/' });
	return redirect(303, '/login');
};
