/**
 *
 * @param {string} url
 * @param {string} payload
 * @returns
 */
const serverFetch = (url, payload) => {
	return fetch(`${process.env.API_ENDPOINT}/${url}`, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});
};

export default serverFetch;
