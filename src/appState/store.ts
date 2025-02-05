import { type Dog } from "@/api/apiBase";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { BASE_CURSOR } from "@/api/searchAPI";

export type SortTypes = "breed:asc" | "breed:desc" | "name:asc" | "name:desc" | "age:asc" | "age:desc"
export const MIN_AGE = 0
export const MAX_AGE = 20

type StoreState = {
	isLoggedIn: boolean,
	setIsLoggedIn: (newVal: boolean) => void,
	currentDogPageList: Dog[],
	setCurrentDogPageList: (newVal: Dog[]) => void,

	//Search Query
	currentSearchQuery: string | undefined,
	/** trigger a search with a supplied query (this should only be done for the api's returned prev/next queries. Otherwise, use startSearchQuery when the user changes an option) */
	setCurrentSearchQuery: (newVal: string) => void,
	/** trigger a search based off all user's current options, starting from page 1 if page is not provided */
	startSearchQuery: (page?: number) => void,
	totalResults: number,
	setTotalResults: (newVal: number) => void,

	//Filtering - zip codes
	desiredZips: string[],
	setDesiredZips: (newVal: string[]) => void,
	//Filtering - breeds
	filterBreeds: Record<string, boolean> | undefined
	editBreed: (breed: string, newVal: boolean) => void
	clearBreedFilter: () => void
	//Filtering - age
	minAge: number,
	setMinAge: (age: number) => void,
	maxAge: number,
	setMaxAge: (age: number) => void,

	//Sorting
	sortByQuery: string,
	setSortBy: (newSort: SortTypes) => void
}

//Typescript gave false errors so I had to to do repetitive assertion of types such as "false as boolean" so that it would stop complaining.
export const useStoreState = create<StoreState>()(
	subscribeWithSelector (
		immer (
			set => ({
				isLoggedIn: false as boolean,
				setIsLoggedIn: newVal => set(() => ({ isLoggedIn: newVal })),
				currentDogPageList: [] as Dog[],
				setCurrentDogPageList: newVal => set(() => ({ currentDogPageList: newVal})),

				//Search Query - made up of cursor, filter, and sort parts. Whenever a cursor or filter changes, trigger a new search. Only trigger a new search when sort changes IF there are actually results to sort.  
				currentSearchQuery: undefined as (string | undefined),
				setCurrentSearchQuery: newVal => set(() => ({ currentSearchQuery: newVal})),
				startSearchQuery: page => {
					set(state => {
						/** create a final query of type "foo=xyz&bar=xyz" from parts ["foo=xyz", bar="xyz"] */
						const addQueryParts = (parts: string[]) => {
							let finalQuery = ''
							for (const part of parts) {
								if (!part) continue //empty strings dont get added
								finalQuery += finalQuery ? `&${part}` : part
							}
							return finalQuery
						}

						//build up the search query
						const zipQuery = prepareZipQuery(state.desiredZips)
						const breedsQuery = prepareFilterBreedsQuery(state.filterBreeds)
						const minAgeQuery = state.minAge === MIN_AGE ? '' : `ageMin=${state.minAge}`
						const maxAgeQuery = state.maxAge === MAX_AGE ? '' : `ageMax=${state.maxAge}`
						const cursor = page ? `size=25&from=${(page - 1) * 25}` : BASE_CURSOR

						const query = addQueryParts([zipQuery, breedsQuery, minAgeQuery, maxAgeQuery, state.sortByQuery, cursor])
						//actual trigger happens now:
						state.currentSearchQuery = query
					})
				},
				totalResults: 0,
				setTotalResults: newVal => set(() => ({ totalResults: newVal })),

				//Filter - zip codes
				desiredZips: [] as string[],
				setDesiredZips: newVal => set(() => ({ desiredZips: newVal })),
				//Filter - breeds
				filterBreeds: undefined as (Record<string, boolean> | undefined),
				editBreed: (breed, newVal) => set(state => {
					if (!state.filterBreeds) {
						state.filterBreeds = { [breed]: newVal }
					}
					else state.filterBreeds[breed] = newVal
				}),
				clearBreedFilter: () => set(() => ({ filterBreeds: {} })),

				//Filter - age
				minAge: MIN_AGE,
				setMinAge: age => set(() => ({ minAge: age})),
				maxAge: MAX_AGE,
				setMaxAge: age => set(() => ({ maxAge: age})),

				//Sorting
				sortByQuery: "sort=breed%3Aasc",
				setSortBy: (newSort) => {
					const sortByQuery = "sort=" + newSort.split(":").join("%3A")
					set(() => ({ sortByQuery }))
				},
			})
		)
	)
)

function prepareZipQuery(zipCodes: string[]) {
	if (!zipCodes.length) {
		return ''
	}
	let queryZips = ''
	for (let i=0; i < zipCodes.length; i++) {
		if (!queryZips) queryZips = `zipCodes${encodeURIComponent(`[${i}]`)}=${zipCodes[i]}`
		else queryZips += `&zipCodes${encodeURIComponent(`[${i}]`)}=${zipCodes[i]}`
	}
	return queryZips
}

function prepareFilterBreedsQuery(filterBreeds: Record<string, boolean> | undefined) {
	if (!filterBreeds) return ''

	let queryBreeds = ''
	const keys = Object.keys(filterBreeds)
	let usedBreedsCount = 0
	for (let i = 0; i < keys.length; i++){
		//a bunch of encodeURIComponent in order to match the text of the api's returned cursors. This makes sure swr keys line up so that un-needed api calls are avoided when navigating back to previous page results.
		const key = keys[i]
		if (filterBreeds[key]) {
			if (!queryBreeds) queryBreeds = `breeds${encodeURIComponent(`[${usedBreedsCount}]`)}=${encodeURIComponent(key)}`
			else queryBreeds += `&breeds${encodeURIComponent(`[${usedBreedsCount}]`)}=${encodeURIComponent(key)}`
			usedBreedsCount++
		}
	}
	return queryBreeds
}

useStoreState.subscribe(
	(state) => [state.filterBreeds], ([newFilterBreeds]) => {
		if (newFilterBreeds) {
			const startSearchQuery = useStoreState.getState().startSearchQuery
			startSearchQuery()
		}
	},
	{ equalityFn: shallow } 
)

useStoreState.subscribe(
	(state) => [state.sortByQuery, state.totalResults], ([newSortByQuery, newTotalResults]) => {
		// only start a new search call if there were actual results (no sense sorting 0 results)
		if (newTotalResults && newSortByQuery) {
			const startSearchQuery = useStoreState.getState().startSearchQuery
			startSearchQuery()
		}
	},
	{ equalityFn: shallow } 
)
