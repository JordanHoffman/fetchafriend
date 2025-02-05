import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import Image from "next/image"
import { Paginator } from "./paginator"
import { useGetSearch } from "@/api/searchAPI"

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

	return (
		<section
			className={`container py-5 border-8 rounded-4xl ${theme.bg}`}
		>
			<h2
				className={`text-4xl md:text-5xl ${theme.text} font-bold mb-3`}
			>
				Results:
			</h2>
			<Paginator 
				prevQuery={searchResult?.result?.prev?.split('?')[1]}
				nextQuery={searchResult?.result?.next?.split('?')[1]}
			/>
			{
				dogs.map(dog => {
					return (
						<div
							key={dog.id}
							className="flex w-full gap-3"
						>
							<div>
								<div>
									{dog.name}
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

							<div>
								{dog.breed}
							</div>
							<div>
								{dog.age}
							</div>
							<div>
								{dog.zip_code}
							</div>
						</div>
					)
				})
			}
		</section>
	)
}