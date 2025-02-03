import { useStoreState } from "@/appState/store"
import Image from "next/image"

export const ResultsList = () => {
	const dogs = useStoreState(s => s.currentDogPageList)

	const currentSearchQuery = useStoreState(s => s.currentSearchQuery)

	if (!currentSearchQuery) {
		return (
			<div>
				do a search
			</div>
		)
	}

	return (
		<div>
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