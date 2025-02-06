import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import { Paginator } from "./paginator"
import { useFavoritesSearch, useGetDogsById } from "@/api/searchAPI"
import { ResultItem } from "./resultItem"
import { useEffect, useState } from "react"
import { Dog } from "@/api/apiBase"
import { DogDialog } from "../dialog/dogDialog"

export const ResultsList = () => {
	const currentDogPageList = useStoreState(s => s.currentDogPageList)
	const favorites = useStoreState(s => s.favorites)
	const showDialog = useStoreState(s => s.showDialog)
	const { triggerFavoritesSearch, data: myMatch } = useFavoritesSearch()
	const [matchedIdToFind, setMatchedIdToFind] = useState<Dog['id'][]>()
	const { dogsResult } = useGetDogsById(matchedIdToFind)

	useEffect(() => {
		if (myMatch) {
			const dogId = myMatch.match
			//check if our current page of dogs has the dogId. If not, do a search to get the dog data
			const dog = currentDogPageList?.find(dog => dog.id === dogId)
			if (!dog) return setMatchedIdToFind([dogId])
			// setMatchedDog({...dog})
		showDialog(<DogDialog dog={dog} isMatch/>)
		}
	}, [myMatch])

	useEffect(() => {
		if (dogsResult && dogsResult[0]) {
			// setMatchedDog({...dogsResult[0]})
			showDialog(<DogDialog dog={dogsResult[0]} isMatch/>)
		}
	}, [dogsResult])

	if (!currentDogPageList) {
		return (
			<div>
				do a search
			</div>
		)
	}

	const mdTwoPerRow = "md:w-0 md:basis-34/100 md:grow md:max-w-1/2"
	const xlThreePerRow = "xl:w-0 xl:basis-26/100 xl:grow xl:max-w-1/3"

	const handleFindMatch = () => {
		const heartList = []
		for (const [key, val] of Object.entries(favorites)) {
			if (val) {
				heartList.push(key)
			}
		}
		if (!heartList.length) {
			alert('please like some dogs')
			return
		}
		triggerFavoritesSearch(heartList)
	}
	return (
		<section
			className={`container px-0 sm:px-3 py-5 border-8 rounded-4xl ${theme.bg}`}
		>
			<div className="flex flex-wrap gap-3 md:gap-10 items-center px-3 sm:px-0 mb-8">
				<h2
					className={`text-4xl md:text-5xl ${theme.text} font-bold`}
				>
					Results:
				</h2>
				<button 
					className={`rounded-full px-5 py-1 font-semibold text-2xl bg-rose-300 text-white border-4 ${theme.border} tracking-wide`}
					onClick={handleFindMatch}
				>
					Find My Match!
				</button>
			</div>

			<Paginator className="px-3 sm:px-0 mb-8" />
			<div className="flex flex-wrap sm:gap-2 mb-8">
				{ currentDogPageList.map(dog => <ResultItem 
					key={dog.id} 
					dog={dog} 
					className={`w-full ${mdTwoPerRow} ${xlThreePerRow}`}
				/>) }
			</div>
			<Paginator className="px-3 sm:px-0 mb-5" />
		</section>
	)
}