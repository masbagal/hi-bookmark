import { API_ENDPOINT } from '$env/static/private';

/**
 *
 * @param {string} url
 * @param {Object} payload
 * @param {string=} accessToken
 */
const serverFetch = async (url, payload, accessToken) => {
	let headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	};

	if (accessToken) {
		// @ts-ignore
		headers = { ...headers, Authorization: `Bearer ${accessToken}` };
	}

	const response = await fetch(`${API_ENDPOINT}${url}`, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers
	});

	return await response.json();
};

export default serverFetch;
