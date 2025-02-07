import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import { Paginator } from "./paginator"
import { useFavoritesSearch, useGetDogsById } from "@/api/searchAPI"
import { ResultItem } from "./resultItem"
import { useEffect, useState } from "react"
import { Dog } from "@/api/apiBase"
import { DogDialog } from "../dialog/dogDialog"
import { useIsLoading } from "./useIsLoading"

export const ResultsList = () => {
	const currentDogPageList = useStoreState(s => s.currentDogPageList)
	const favorites = useStoreState(s => s.favorites)
	const showDialog = useStoreState(s => s.showDialog)
	const { triggerFavoritesSearch, data: myMatch } = useFavoritesSearch()
	const [matchedIdToFind, setMatchedIdToFind] = useState<Dog['id'][]>()
	const { dogsResult } = useGetDogsById(matchedIdToFind)
	const isSearching = useIsLoading()

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

	let problemText = ""
	if (!currentDogPageList) problemText = "Start searching to fetch a new best friend!"
	else if (!currentDogPageList.length) problemText = "No dogs were found. Try changing your location or search options."

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
			alert('Please favorite some dogs to find a match.')
			return
		}
		triggerFavoritesSearch(heartList)
	}
	return (
		<section
			className={`relative container px-0 sm:px-3 py-5 border-8 rounded-4xl ${theme.bg} min-h-[400px]`}
		>
			{isSearching && <div className="z-1 w-full h-full top-0 left-0 rounded-3xl absolute flex pt-40 justify-center bg-green-100/50">
				<svg aria-hidden="true" className="size-30 animate-spin fill-green-700 text-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
			</svg>
			</div>}
			<div className="flex flex-wrap gap-3 md:gap-10 items-center px-3 sm:px-0 mb-8">
				<h2
					className={`text-4xl md:text-5xl ${theme.text} font-bold`}
				>
					Results:
				</h2>
				{!problemText && <button 
					className={`rounded-full px-5 py-1 font-semibold text-2xl bg-rose-300 text-white border-4 ${theme.border} tracking-wide`}
					onClick={handleFindMatch}
				>
					Find My Match!
				</button>}
			</div>

			{problemText ? <h3 className={`px-3 sm:px-0 text-2xl`}>{problemText}</h3> : 
				<>
					<Paginator className="px-3 sm:px-0 mb-8" />
					<div className="flex flex-wrap sm:gap-2 mb-8">
						{currentDogPageList!.map(dog => <ResultItem 
							key={dog.id} 
							dog={dog} 
							className={`w-full ${mdTwoPerRow} ${xlThreePerRow}`}
						/>)}
					</div>
					<Paginator className="px-3 sm:px-0 mb-5" />
				</>
			}
		</section>
	)
}