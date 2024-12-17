// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userContext: {
				isLoggedIn: boolean;
				email: string;
				name: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface PublicEnv {
			PUBLIC_API_ENDPOINT: string;
		}
	}
}

export {};
