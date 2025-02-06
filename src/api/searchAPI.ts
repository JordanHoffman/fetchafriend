import useSWRImmutable from "swr/immutable"
import { Dog, fetcher, FetchError, FetchReponse, poster, ROUTE } from "./apiBase"
// import useSWRMutation from "swr/mutation"
import { useEffect } from "react"
import { useStoreState } from "@/appState/store"
import useSWRMutation from "swr/mutation"

//Goal is to always have consistent queries with backend as frontend keys to minimize repetitious api calls. This is how the backend returns the query for the very first page.
export const BASE_CURSOR = "size=25&from=0"
export const BASE_SORT = `breed${encodeURIComponent(':')}desc=`
export const BASE_QUERY = `${BASE_CURSOR}&${BASE_SORT}`

type DogBreed = string
type GetBreeds = FetchReponse<DogBreed[]>
export function useGetBreeds() {
	const { data, error, isLoading, isValidating } = useSWRImmutable<GetBreeds, FetchReponse<null>>(
		ROUTE.GET.BREEDS,
		fetcher,
		{ 
			onErrorRetry: async (error: FetchReponse<null>, key, config, revalidate, { retryCount }) => {
				console.log('error retry')
				const e = error
				if (e.status === 401) return
				if (retryCount >= 3) return
				setTimeout(() => revalidate({ retryCount }), 1000)
			}
		}
	)

	const breeds = data
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
export type GetSearch = FetchReponse<SearchResult>
export const useGetSearch = (query?: string) => {
	const setTotalResults = useStoreState(s => s.setTotalResults)
	const { data, error, isLoading, isValidating } = useSWRImmutable<GetSearch, FetchReponse<null>> (
		query !== undefined ? `${ROUTE.GET.SEARCH}${query ? `?${query}` : ""}` : null,
		fetcher,
	)
	const searchResult = data
	useEffect(() => {
		if (data?.result) {
			setTotalResults(data.result.total)
		}
	}, [data])
	return { 
		searchResult,
		error,
		isLoading,
		isValidating
	}
}

/**
 * This POST function uses useSWRImmutable instead of the typical useMutation to take advantage of caching dog results to prevent uneeded api calls.
 * @param dogIds 
 */
export function useGetDogsById(dogIds?: DogId[]) {
	const { data, error, isLoading, isValidating } = useSWRImmutable<Dog[], FetchError> (
		//convert dogIds to string for cache key
		(dogIds && dogIds.length) ? [ROUTE.POST.DOGS, dogIds.join(" ")]: null,
		([url]) => poster(url, {arg: dogIds}),
	)

	//special case where initial search returned empty array (no matches). No api call, but return dogResult as empty array to allow app logic to continue from there.
	if (dogIds?.length === 0) {
		return {
			dogsResult:[],
			error: undefined,
			isLoading: false,
			isValidating: false
		}
	}

	const dogsResult = data
	return { 
		dogsResult,
		error,
		isLoading,
		isValidating
	}
}

export function useFavoritesSearch() {
	const { 
		trigger,
		data,
		error,
		isMutating
	} = useSWRMutation<{match: string}, FetchError, string, DogId[]>(
		ROUTE.POST.DOGS_MATCH, 
		poster,
		{
			onError: err => {
				if (err.status === 401) return
				else console.error("error finding match: ", err)
			}
		}	
		
	)
	return {
		triggerFavoritesSearch: trigger,
		data,
		error,
		isMutating
	}
}


/**
 * Goal: get location from a zip, use its lat and long with the formula to get 25 sq. mile. Plug those into geoBoundingBox to get list of zips to include for dog search.
 */
type GeoLoc = {
	city: string,
	latitude: number,
	county: string,
	state: string,
	zip_code: string,
	longitude: number
} 
export function useZipLocation(zip?: string) {
	const { data, error, isLoading, isValidating } = useSWRImmutable<GeoLoc[], FetchError> (
		(zip && zip.length) ? [ROUTE.POST.LOCATIONS, zip]: null,
		([url, zip]) => poster(url, {arg: [zip]}),
	)

	//special case where initial search returned empty array (no matches). No api call, but return dogResult as empty array to allow app logic to continue from there.
	if (!zip) {
		return {
			locationResult: null,
			error: undefined,
			isLoading: false,
			isValidating: false
		}
	}

	const locationResult = data
	return { 
		locationResult,
		error,
		isLoading,
		isValidating
	}
}

type LatLong = {
	lat: number
	lon: number
}
export type Bounds = {
	bottom_left: LatLong,
	top_right: LatLong
}
export type LocationSearchResult = {
	results: GeoLoc[],
	total: number
}
export function useLocationSearch(bounds?: Bounds) {
	const boundsCacheKey= bounds ? `${bounds.bottom_left.lat}|${bounds.bottom_left.lon}_${bounds.top_right.lat}|${bounds.top_right.lon}` : ""

	const { data, error, isLoading, isValidating } = useSWRImmutable<LocationSearchResult, FetchError> (
		bounds ? [ROUTE.POST.LOCATIONS_SEARCH, boundsCacheKey]: null,
		([url]) => poster(url, {arg: {geoBoundingBox: {...bounds}}}),
		{ 
			onErrorRetry: async (error: FetchReponse<null>, key, config, revalidate, { retryCount }) => {
				console.error(`error useLocationSearch: ${error}`)
				return
			}
		}
	)

	//special case where initial search returned empty array (no matches). No api call, but return dogResult as empty array to allow app logic to continue from there.
	if (!bounds) {
		return {
			locationSearchResult: null,
			error: undefined,
			isLoading: false,
			isValidating: false
		}
	}

	const locationSearchResult = data
	return { 
		locationSearchResult,
		error,
		isLoading,
		isValidating
	}
}

export function usePlaceSearch(city?: string) {
	city = city?.toLowerCase()

	const { data, error, isLoading, isValidating } = useSWRImmutable<LocationSearchResult, FetchError> (
		city ? [ROUTE.POST.LOCATIONS_SEARCH, city]: null,
		([url]) => poster(url, {arg: { city }}),
		{ 
			onErrorRetry: async (error: FetchReponse<null>, key, config, revalidate, { retryCount }) => {
				console.error(`error useLocationSearch: ${error}`)
				return
			}
		}
	)

	//special case where initial search returned empty array (no matches). No api call, but return dogResult as empty array to allow app logic to continue from there.
	if (!city) {
		return {
			locationSearchResult: null,
			error: undefined,
			isLoading: false,
			isValidating: false
		}
	}

	const placeSearchResult = data
	return { 
		placeSearchResult,
		error,
		isLoading,
		isValidating
	}
}