import useSWRImmutable from "swr/immutable"
import { Dog, fetcher, FetchError, FetchReponse, poster, ROUTE } from "./apiBase"
import useSWRMutation from "swr/mutation"

//Goal is to always have consistent queries with backend as frontend keys to minimize repetitious api calls. This is how the backend returns the query for the very first page.
export const BASE_QUERY = "size=25&from=0"

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
	)

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