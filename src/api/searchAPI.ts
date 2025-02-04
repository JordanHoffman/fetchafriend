import useSWRImmutable from "swr/immutable"
import { Dog, fetcher, FetchError, FetchReponse, poster, ROUTE } from "./apiBase"
import useSWRMutation from "swr/mutation"
import { useEffect } from "react"
import { useStoreState } from "@/appState/store"

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
				const e = await error
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
type GetSearch = FetchReponse<SearchResult>
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
		//conver dogIds to string for cache key
		(dogIds && dogIds.length) ? [ROUTE.POST.DOGS, dogIds.join(" ")]: null,
		//dogIds will be that string here, convert it back to its array form.
		([url, dogIds]) => poster(url, {arg: (dogIds as string).split(" ")}),
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


export function useZip() {
	const {
		trigger,
		data,
		error,
		isMutating
	} = useSWRMutation(
		ROUTE.POST.LOCATIONS,
		poster<string[]>
	)

	return {
		triggerZip: trigger,
		data,
		error,
		isMutating
	}
}

/*

Chat gpt for utility functions to get radius bounding box for given zip:

// Earth's radius in miles
const EARTH_RADIUS_MILES = 3960;

// Function to calculate the latitude and longitude changes for a given distance (in miles)
function getBoundingBox(lat, lon, distance) {
  // Calculate latitude change
  const deltaLat = distance / EARTH_RADIUS_MILES;
  
  // Convert latitude to radians for the cosine calculation
  const latRad = (lat * Math.PI) / 180;
  
  // Calculate longitude change, adjusting for latitude
  const deltaLon = distance / (EARTH_RADIUS_MILES * Math.cos(latRad));

  // Calculate top-right and bottom-left coordinates
  const topRightLat = lat + deltaLat;
  const topRightLon = lon + deltaLon;

  const bottomLeftLat = lat - deltaLat;
  const bottomLeftLon = lon - deltaLon;

  return {
    topRight: { lat: topRightLat, lon: topRightLon },
    bottomLeft: { lat: bottomLeftLat, lon: bottomLeftLon }
  };
}

// Example usage:
const lat = 37.7749;  // San Francisco latitude
const lon = -122.4194;  // San Francisco longitude
const distance = 25;  // 25 miles radius

const boundingBox = getBoundingBox(lat, lon, distance);
console.log("Top-right:", boundingBox.topRight);
console.log("Bottom-left:", boundingBox.bottomLeft);

*/