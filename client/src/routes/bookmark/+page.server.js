import { protectedFetch } from '$lib/clientFetch.js';

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const payload = {
			url: data.get('url')
		};

		const result = await protectedFetch('/bookmark/add', payload);
		return await result.json();
	}
};
