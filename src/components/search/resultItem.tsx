import { Dog } from "@/api/apiBase"
import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import Image from "next/image"
import { DogDialog } from "../dialog/dogDialog"

export const ResultItem = ({
	dog,
	className = ""
}:{
	dog: Dog,
	className?: string
}) => {
	const favorites = useStoreState(s => s.favorites)
	const toggleFavorite = useStoreState(s => s.toggleFavorite)
	const showDialog = useStoreState(s => s.showDialog)

	const labelStyling = "flex flex-col sm:flex-row"

	const getLabel = (name: string, value: string | number, customStyle = "") => {
		return (
			<div className={`${labelStyling} ${customStyle} sm:text-lg`}>
				<span className="font-medium">{name}:&nbsp;</span>
				{value}
			</div>
		)
	}

	const isFavorite = !!favorites[dog.id]

	return (
		<div
			className={`flex flex-col min-[450px]:flex-row-reverse min-[450px]:justify-end gap-2 ${theme.border} py-3 border-t-2 sm:border-2 sm:rounded-3xl bg-green-50 ${className} px-3`}
		>
			<div className="flex gap-8">
				<div>
					<div className={`${labelStyling} mb-3`}>
						{getLabel('Name', dog.name, "md:flex-col")}
					</div>
					<button 
						onClick={() => showDialog(<DogDialog dog={dog} />)}
						className={`relative w-[100px] h-[100px]`}
					>
						<Image
							alt={`a ${dog.breed} named ${dog.name}`}
							src={dog.img}
							fill={true}
							className={`object-cover max-w-full max-h-full rounded-xl ${theme.border} border-2`}
							sizes="(max-width: 768px) 100px, (max-width: 1200px) 100px, 100px"
						/>
					</button>
				</div>

				<div className="flex flex-col gap-1">
					{getLabel('Breed', dog.breed, "md:flex-col")}
					{getLabel('Age', dog.age)}
					{getLabel('ZIP', dog.zip_code)}
				</div>
			</div>

			{/* heart button */}
			<div className="flex ml-5 min-[450px]:ml-0 min-[450px]:self-center">
				<button 
					className="py-1 px-2"
					onClick={() => toggleFavorite(dog.id)}
				>
					{ !isFavorite ?
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
					</svg> :
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-10 fill-rose-300">
						<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
					</svg>
					}
				</button>
			</div>
		</div>
	)
}