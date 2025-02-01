'use client'

import { useGetDogsById, useGetSearch } from "@/api/api"
import { useStoreState } from "@/appState/store"
import { useEffect, useState } from "react"
import Image from "next/image"

export const Search = () => {
	// const currentSearchQuery = useStoreState(s => s.currentSearchQuery)

	/* whenever currentQuery updates, it causes a chain reaction which  
		1) triggers Get /dogs/search to get the id results 
		2) triggers POST /dogs with those id results in order to get final dog object list. 
		Conclusion: only update currentQuery when you want new data.
	*/
	const [currentQuery, setCurrentQuery] = useState<string | undefined>(undefined)
	const [nextQuery, setNextQuery] = useState<string | undefined>(undefined)

	const dogs = useStoreState(s => s.currentDogPageList)
	// const setCurrentSearchQuery = useStoreState(s => s.setCurrentSearchQuery)
	const setCurrentDogPageList = useStoreState(s => s.setCurrentDogPageList)

	const { searchResult } = useGetSearch(currentQuery)
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

	useEffect(() => {
		console.log('dogs: ', dogs)
	}, [dogs])

	return (
		<div>
			<div className="flex gap-3">
				<button
					onClick={() => {
						if (searchResult?.result?.prev) {
							const newQuery = searchResult.result.prev.split('?')[1]
							setCurrentQuery(newQuery)
						}
					}}
				>
					previous
				</button>
				<button
					onClick={() => {
						if (searchResult?.result?.next) {
							const newQuery = searchResult.result.next.split('?')[1]
							setCurrentQuery(newQuery)
						}
					}}
				>
					next
				</button>
				<button
					className="ml-5"
					onClick={() => setCurrentQuery('size=25&from=0')}
				>
					SEARCH
				</button>
			</div>

			{
				dogs.map(dog => {
					return (
						<div
							key={dog.id}
							className="flex w-full gap-3"
						>
							<div>
								{dog.name}
							</div>
							<div>
								{dog.breed}
							</div>
							<div>
								{dog.age}
							</div>
							<div>
								{dog.zip_code}
							</div>
							<div className="relative w-[100px] h-[100px]">
								<Image
									alt={`a ${dog.breed} named ${dog.name}`}
									src={dog.img}
									fill={true}
									className="object-contain"
									sizes="(max-width: 768px) 100px, (max-width: 1200px) 100px, 100px"
								/>
							</div>

						</div>
					)
				})
			}

		</div>
	)
}