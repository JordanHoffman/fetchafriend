import { Dog } from "@/api/apiBase";
import { useStoreState } from "@/appState/store";
import { theme } from "@/theme";
import Image from "next/image";

export const DogDialog = ({
	dog,
	isMatch = false
}:{
	dog: Dog
	isMatch?: boolean
}) => {
	const closeDialog = useStoreState(s => s.closeDialog)
	const favorites = useStoreState(s => s.favorites)
	const isFavorite = !!favorites[dog.id]
	const toggleFavorite = useStoreState(s => s.toggleFavorite)

	return (
		<div className={`py-5 flex flex-col items-center w-full`}>
			<h2 className="text-4xl font-bold mb-3 text-center">
				{isMatch ? `We've Found a Match!` : `Could it be me?`}
			</h2>
			<h3 className="text-3xl font-semibold mb-3 text-center">
				Meet {dog.name}
			</h3>

			<Image
				alt={`a ${dog.breed} named ${dog.name}`}
				src={dog.img}
				width={300}
				height={300}
				className={`rounded-2xl border-2 w-full max-w-[500px] max-h-[500px] mb-4`}
				sizes="500px"
			/>

			<p
				className="text-xl text-center px-3 mb-5"
			>
				{dog.name} is a {dog.age} year old {dog.breed} located at the ZIP code area of {dog.zip_code}.
			</p>

			{!isMatch && <div className="flex items-center mb-3">
				<p className="text-xl">Please like me!</p>
							{/* heart button */}
				<div className="flex">
					<button 
						className="py-1 px-2"
						onClick={() => toggleFavorite(dog.id)}
					>
						{ !isFavorite ?
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
						</svg> :
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-12 fill-rose-300">
							<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
						</svg>
						}
					</button>
				</div>
			
			</div>}

			<button 
				onClick={closeDialog}
				className={`w-full max-w-[280px] ${theme.bg} border-5 rounded-full text-2xl font-semibold py-1`}
			>
				Keep Searching
			</button>

		</div>
	)
}