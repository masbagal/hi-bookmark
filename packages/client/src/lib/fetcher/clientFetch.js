/**
 * @param {string} url
 * @param {*} payload
 * @returns
 */
export const clientFetch = (url, payload) => {
	return fetch(`/api${url}`, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});
};
