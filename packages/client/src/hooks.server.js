import { redirect } from '@sveltejs/kit';
import serverFetch from '$lib/fetcher/fetch';
import { COOKIE_ACCESS_TOKEN } from '$lib/constants';

const PUBLIC_URLS = ['/login', '/register'];

export const handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const isPublicRoute = PUBLIC_URLS.includes(pathname);
	let isLoggedIn = false;
	try {
		const response = await serverFetch('/user/whoami', {}, event.cookies.get(COOKIE_ACCESS_TOKEN));
		const userContext = await response.json();
		isLoggedIn = userContext.isLoggedIn;
		// Store in locals to be read in another pages
		event.locals.userContext = userContext;
	} catch (error) {
		return redirect(302, '/login');
	}

	if (!isPublicRoute && !isLoggedIn) {
		return redirect(302, '/login');
	}

	if (isPublicRoute && isLoggedIn) {
		return redirect(302, '/bookmark');
	}

	return await resolve(event);
};
