import { useStoreState } from "@/appState/store";
import useSWRImmutable from "swr/immutable"
import useSWRMutation from "swr/mutation"

type FetchReponse<T> = { success: boolean, status: number, message?: string, result: T }
type FetchError = FetchReponse<null>

export type Dog = {
	id: string
	img: string
	name: string
	age: number
	zip_code: string
	breed: string
}

const prepareResponseError = async (r: Response) => {
	const contentType = r.headers.get("content-type");
	let message = `request to ${r.url} failed.`

	if (contentType?.includes('text/plain')) {
		const details = await r.text()
		message += ` ${details}`
	}
	const fetchError: FetchError = {
		success: false,
		status: r.status,
		message: message,
		result: null,
	}
	return fetchError
}

const fetcher = (url: string | URL | Request ) => fetch(url, {
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


async function poster<T> (
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

const BASE_URL = "https://frontend-take-home-service.fetch.com"

const makeRoute = (path: string) => (BASE_URL + path)

const ROUTE = {
	GET: {
		BREEDS: makeRoute('/dogs/breeds'),
		SEARCH: makeRoute('/dogs/search')
	},
	POST: {
		LOGIN: makeRoute('/auth/login'),
		LOGOUT: makeRoute('/auth/logout'),
		DOGS: makeRoute('/dogs')
	}
}

type LoginBody = {
	name: string,
	email: string
}
export function useLogin() {
	const setIsLoggedIn = useStoreState(s => s.setIsLoggedIn)
	const {
		trigger,
		data,
		error,
		isMutating
	} = useSWRMutation(
		ROUTE.POST.LOGIN,
		poster<LoginBody>,
		{
			onSuccess: () => {
				setIsLoggedIn(true)
			}
		}
	)

	return {
		triggerLogin: trigger,
		data,
		error,
		isMutating
	}
}

export function useLogout() {
	const setIsLoggedIn = useStoreState( s => s.setIsLoggedIn )

	const {
		trigger,
		data,
		error,
		isMutating
	} = useSWRMutation<null>(
		ROUTE.POST.LOGOUT,
		poster,
		{
			onSuccess: () => {
				setIsLoggedIn(false)
			}
		}
	)

	return {
		triggerLogout: trigger,
		data,
		error,
		isMutating
	}
}

type DogBreed = string
type GetBreeds = FetchReponse<DogBreed[]>
export function useGetBreeds() {
	const { data = {result: []}, error, isLoading, isValidating } = useSWRImmutable<GetBreeds, FetchReponse<null>>(
		ROUTE.GET.BREEDS,
		fetcher,
		{ 
			onErrorRetry: (error: FetchReponse<null>, key, config, revalidate, { retryCount }) => {
				if (error.status === 401) return
				if (retryCount >= 3) return
				setTimeout(() => revalidate({ retryCount }), 1000)
			}
		}
	)

	const breeds = data!
	return { 
		breeds,
		error,
		isLoading,
		isValidating
	}
}

type DogId = string
type SearchResult = {
	resultIds: DogId[],
	total: number,
	next?: string,
	prev?: string

}
type GetSearch = FetchReponse<SearchResult>
export const useGetSearch = (query?: string) => {
	const { data, error, isLoading, isValidating } = useSWRImmutable<GetSearch, FetchReponse<null>> (
		query !== undefined ? `${ROUTE.GET.SEARCH}${query ? `?${query}` : ""}` : null,
		fetcher,
	)

	const searchResult = data
	return { 
		searchResult,
		error,
		isLoading,
		isValidating
	}
}

// type GetDogsByIdReturnType = Dog[] | FetchError
// export function useGetDogsById() {
// 	const setCurrentDogPageList = useStoreState(s => s.setCurrentDogPageList)
// 	const {
// 		trigger,
// 		data,
// 		error,
// 		isMutating
// 	} = useSWRMutation<GetDogsByIdReturnType, Error, string, DogId[]>(
// 		ROUTE.POST.DOGS,
// 		poster,
// 		{
// 			onSuccess: (data) => {
// 				if (Array.isArray(data)) {
// 					setCurrentDogPageList(data)
// 				}
// 				else {
// 					if (data?.status === 401){
// 						console.warn('need to log in')
// 					}
// 					setCurrentDogPageList([])
// 					console.warn('failed to get dogs. Returned: ', data)
// 				}
// 			}
// 		}
// 	)

// 	return {
// 		triggerGetDogsById: trigger,
// 		data,
// 		error,
// 		isMutating
// 	}
// }

/**
 * This POST function uses useSWRImmutable instead of the typical useMutation to take advantage of caching dog results to prevent uneeded api calls.
 * @param dogIds 
 * @returns 
 */
export function useGetDogsById(dogIds?: DogId[]) {
	const { data, error, isLoading, isValidating } = useSWRImmutable<Dog[], FetchError> (
		//conver dogIds to string for cache key
		dogIds ? [ROUTE.POST.DOGS, dogIds.join(" ")]: null,
		//dogIds will be that string here, convert it back to its array form.
		([url, dogIds]) => poster(url, {arg: (dogIds as string).split(" ")}),
		{
			onSuccess: (data) => {
				console.log('success fetch of post: ', data)
			}
		}
	)

	const dogsResult = data
	return { 
		dogsResult,
		error,
		isLoading,
		isValidating
	}
}