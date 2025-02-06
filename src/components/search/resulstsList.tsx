import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import { Paginator } from "./paginator"
import { useGetSearch } from "@/api/searchAPI"
import { ResultItem } from "./resultItem"

export const ResultsList = () => {
	const dogs = useStoreState(s => s.currentDogPageList)

	const currentSearchQuery = useStoreState(s => s.currentSearchQuery)
	const { searchResult } = useGetSearch(currentSearchQuery)

	if (!currentSearchQuery) {
		return (
			<div>
				do a search
			</div>
		)
	}

	const mdTwoPerRow = "md:w-0 md:basis-34/100 md:grow md:max-w-1/2"
	const xlThreePerRow = "xl:w-0 xl:basis-26/100 xl:grow xl:max-w-1/3"
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
				<button className={`rounded-full px-5 py-1 font-semibold text-2xl bg-rose-300 text-white border-4 ${theme.border} tracking-wide`}>
					Find My Match!
				</button>
			</div>

			<Paginator 
				prevQuery={searchResult?.result?.prev?.split('?')[1]}
				nextQuery={searchResult?.result?.next?.split('?')[1]}
				className="px-3 sm:px-0 mb-8"
			/>
			<div className="flex flex-wrap sm:gap-2 mb-8">
				{ dogs.map(dog => <ResultItem 
					key={dog.id} 
					dog={dog} 
					className={`w-full ${mdTwoPerRow} ${xlThreePerRow}`}
				/>) }
			</div>
			<Paginator 
				prevQuery={searchResult?.result?.prev?.split('?')[1]}
				nextQuery={searchResult?.result?.next?.split('?')[1]}
				className="px-3 sm:px-0 mb-5"
			/>
		</section>
	)
}