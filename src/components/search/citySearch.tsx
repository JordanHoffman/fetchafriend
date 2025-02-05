import { Bounds, useLocationSearch, usePlaceSearch, useZipLocation } from "@/api/searchAPI"
import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import { useEffect, useRef, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
type Inputs = {
	city: string
}
export const CitySearch = ({ className = "" }: {className?: string}) => {
	const [currentCity, setCurrentCity] = useState("")

	const { placeSearchResult, error: PlaceSearchError } = usePlaceSearch(currentCity)

	const startSearchQuery = useStoreState(s => s.startSearchQuery)
	const setDesiredZips = useStoreState(s => s.setDesiredZips)

	const triggerSearch = useRef(false)
	
	const setDesiredZipsAndSearch = (desiredZips: string[] = []) => {
		//zustand's state updates are synchronous. I can set the desired zips and immediately call the search fx and it will have those zips in the fx.
		setDesiredZips(desiredZips)
		startSearchQuery()
	}

	useEffect(() => {
		if (triggerSearch.current) {
			if (PlaceSearchError) {
				console.error('error with location search')
				setDesiredZips([])
			}
			if (placeSearchResult) {
				if (!placeSearchResult.results.length) {
					alert('no locations found for city name')
					setDesiredZipsAndSearch()
					triggerSearch.current = false
					return
				}

				//tweeze out desired zips from results
				//api seems to fail shortly after 20 zips, so limit it to that
				const zips = placeSearchResult.results.map(loc => loc.zip_code)
				setDesiredZipsAndSearch(zips.slice(0,20))
				triggerSearch.current = false
			}
		}
	}, [placeSearchResult, PlaceSearchError])

	const {
		register,
		handleSubmit,
		// watch,
		formState: { errors },
	} = useForm<Inputs>({ 
		mode: "onSubmit",
		reValidateMode: "onSubmit"
	})

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		//user pressed search with same city. It's possible they changed other settings elsewhere, so just trigger a fresh search
		const city = data.city.trim()
		if (currentCity === city) {
			return startSearchQuery()
		}

		setCurrentCity(city)
		triggerSearch.current = true
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={className}
		>
			<h3
				className="text-xl font-medium mb-1"
			>
				Search By City Or ZIP
			</h3>
			<div
				className="flex items-start flex-wrap gap-4 mb-5"
			>
				<div
					className="flex flex-col"
				>
					<input 
						{...register("city", {
							required: false, 
							minLength: {
								value: 3,
								message: "city must have at least 3 letters"
							},
							pattern: {
								value: /^[A-Za-z\s]*$/,
								message: "Please enter a valid city or leave empty"
							}
						})}
						className="border-2 rounded-xl text-lg bg-white text-lg px-2 h-[35px] min-w-[220px]"
						placeholder="All Locations"
						type="text"
						maxLength={30}
						onInput={(e) => {
							//force only numeric input
							const target = e.target as HTMLInputElement
							target.value = target.value.
							trimStart() // remove leading whitespace      
							.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
							.replace(/[^A-Za-z\s]/g, "") // Remove non-alphabetic characters
						}}
					/>
					{/* errors will return when field validation fails  */}
					{errors.city && <span className="text-sm text-red-700">{errors.city.message}</span>}
				</div>

				<button 
					className={`flex justify-center items-center rounded-full px-10 hover:cursor-pointer ${theme.bgDark} text-white text-xl font-medium py-2 h-[35px] min-w-[220px]`} 
					type="submit">
					SEARCH
				</button>
			</div>

		</form>
	)
}