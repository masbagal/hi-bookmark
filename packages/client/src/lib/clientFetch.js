import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { TOKEN_STORAGE_KEY } from './constants';

/**
 * @param {string} url
 * @param {*} payload
 * @returns
 */
export const publicFetch = (url, payload) => {
	return fetch(`${PUBLIC_API_ENDPOINT}/${url}`, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});
};

/**
 * @param {string} url
 * @param {*} payload
 * @returns
 */
export const protectedFetch = async (url, payload) => {
	const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
	return fetch(`${PUBLIC_API_ENDPOINT}${url}`, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});
};

/**
 * @param {string} url
 * @returns
 */
export const protectedGet = async (url) => {
	const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
	return fetch(`${PUBLIC_API_ENDPOINT}${url}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});
};
