'use client'

import { BASE_QUERY, useGetDogsById, useGetSearch, useZip } from "@/api/searchAPI"
import { useStoreState } from "@/appState/store"
import { useEffect, useState } from "react"
import { FilterResults } from "./filterResults"
import { ResultsList } from "./resulstsList"

export const Search = () => {
	const currentSearchQuery = useStoreState(s => s.currentSearchQuery)
	const setCurrentSearchQuery = useStoreState(s => s.setCurrentSearchQuery)

	/* whenever currentQuery updates, it causes a chain reaction which  
		1) triggers Get /dogs/search to get the id results 
		2) triggers POST /dogs with those id results in order to get final dog object list. 
		Conclusion: only update currentQuery when you want new data.
	*/
	const [nextQuery, setNextQuery] = useState<string | undefined>(undefined)

	const setCurrentDogPageList = useStoreState(s => s.setCurrentDogPageList)

	const { searchResult } = useGetSearch(currentSearchQuery)
	const { dogsResult } = useGetDogsById(searchResult?.result?.resultIds)

	const { searchResult: nextSearchResult } = useGetSearch(nextQuery)
	useGetDogsById(nextSearchResult?.result.resultIds)

	useEffect(() => {
		if (dogsResult) {
			setCurrentDogPageList(dogsResult)
		}
	}, [dogsResult])


	useEffect(() => {
		if (searchResult?.result) {
			const { next } = searchResult.result
			if (next) {
				setNextQuery(next?.split('?')[1]) 
			}
			else {
				setNextQuery(undefined)
			}
		}
	}, [searchResult])

	const { triggerZip } = useZip()

	return (
		<div>
			<div className="flex gap-3">
				<button
					onClick={() => {
						if (searchResult?.result?.prev) {
							const newQuery = searchResult.result.prev.split('?')[1]
							setCurrentSearchQuery(newQuery)
						}
					}}
				>
					previous
				</button>
				<button
					onClick={() => {
						if (searchResult?.result?.next) {
							const newQuery = searchResult.result.next.split('?')[1]
							setCurrentSearchQuery(newQuery)
						}
					}}
				>
					next
				</button>
				<button
					className="ml-5"
					onClick={() => setCurrentSearchQuery(BASE_QUERY)}
				>
					SEARCH
				</button>
				<button
					className="ml-5"
					onClick={() => {triggerZip(['33180'])}}
				>
					ZIP
				</button>
				<FilterResults />
			</div>

			<ResultsList />
		</div>
	)
}