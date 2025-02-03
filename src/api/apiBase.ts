export type FetchReponse<T> = { success: boolean, status: number, message?: string, result: T }
export type FetchError = FetchReponse<null>

export type Dog = {
	id: string
	img: string
	name: string
	age: number
	zip_code: string
	breed: string
}

export const prepareResponseError = (r: Response) => {
	const fetchError: FetchError = {
		success: false,
		status: r.status,
		message: `request to ${r.url} failed.`,
		result: null,
	}
	return fetchError
}

export const fetcher = (url: string | URL | Request ) => fetch(url, {
	credentials: 'include'
}).then( async r => {
	const contentType = r.headers.get("content-type")

	if (!r.ok) {
		throw(prepareResponseError(r))
	}

	const response: FetchReponse<any> = {
		success: true,
		status: r.status,
		result: null 
	}

	if (contentType?.includes('text/plain')) {
		response.result = await r.text()
		return response
	}

	response.result = await r.json()
	return response
})


export async function poster<T> (
	url: string | URL | Request, 
	{ arg }: { arg: T}
) 
{
	const r = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(arg)
	})

	const contentType = r.headers.get("content-type")

	if (!r.ok) {
		return prepareResponseError(r)
	}
	if (contentType?.includes('text/plain')) {
		return r.text()
	}
	return r.json()
}

export const BASE_URL = "https://frontend-take-home-service.fetch.com"

export const makeRoute = (path: string) => (BASE_URL + path)

export const ROUTE = {
	GET: {
		BREEDS: makeRoute('/dogs/breeds'),
		SEARCH: makeRoute('/dogs/search')
	},
	POST: {
		LOGIN: makeRoute('/auth/login'),
		LOGOUT: makeRoute('/auth/logout'),
		DOGS: makeRoute('/dogs'),
		LOCATIONS: makeRoute('/locations')
	}
}

