'use client'

import { useGetDogsById, useGetSearch } from "@/api/searchAPI"
import { useStoreState } from "@/appState/store"
import { useEffect, useState } from "react"
import { FilterTool } from "./filterTool"
import { ResultsList } from "./resulstsList"
import { SortTool } from "./sortTool"
import { Paginator } from "./paginator"
import { ZipSearch } from "./zipSearch"
import { CitySearch } from "./citySearch"
import { theme } from "@/theme"

export const Search = () => {
	const currentSearchQuery = useStoreState(s => s.currentSearchQuery)
	const setCurrentSearchQuery = useStoreState(s => s.setCurrentSearchQuery)
	const startSearchQuery = useStoreState(s => s.startSearchQuery)

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

	return (
		<div className={`border-8 rounded-4xl mt-10 px-4 lg:px-8 py-10 ${theme.bg}`}>
			<div className="flex flex-col lg:flex-row gap-3 lg:gap-10 xl:gap-15">
				{/* <ZipSearch /> */}
				<CitySearch />
				
				<FilterTool className="xl:min-w-[450px]"/>
				<SortTool className="max-w-[400px] md:max-w-full lg:max-w-[350px]"/>
			</div>

			<Paginator 
				prevQuery={searchResult?.result?.prev?.split('?')[1]}
				nextQuery={searchResult?.result?.next?.split('?')[1]}
			/>

			<ResultsList />
		</div>
	)
}