import { Bounds, useLocationSearch, usePlaceSearch, useZipLocation } from "@/api/searchAPI"
import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import { useEffect, useRef, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
type Inputs = {
	cityOrZip: string
}
export const CityZipSearch = ({ className = "" }: {className?: string}) => {

	const [hasChanges, setHasChanges] = useState(true)
	const resetFavorites = useStoreState(s => s.resetFavorites)

	//city related searching
	const currentCity = useStoreState(s => s.currentCity)
	const setCurrentCity = useStoreState(s => s.setCurrentCity)
	const { placeSearchResult, error: PlaceSearchError } = usePlaceSearch(currentCity)

	//zip related searching
	const currentZip = useStoreState(s => s.currentZip)
	const setCurrentZip = useStoreState(s => s.setCurrentZip)
	const currentZipBounds = useStoreState(s => s.currentZipBounds)
	const setCurrentZipBounds = useStoreState(s => s.setCurrentZipBounds)
	const { locationResult, error: locationError } = useZipLocation(currentZip)
	const { locationSearchResult, error: LocationSearchError } = useLocationSearch(currentZipBounds)

	//final outcome of either city or zip searches will be desiredZips to put into search query
	const startSearchQuery = useStoreState(s => s.startSearchQuery)
	const setDesiredZips = useStoreState(s => s.setDesiredZips)

	const triggerSearch = useRef(false)
	
	/**
	 * If no desired zips are provided, it will search all locations
	 */
	const setDesiredZipsAndSearch = (desiredZips: string[] = []) => {
		//zustand's state updates are synchronous. I can set the desired zips and immediately call the search fx and it will have those zips in the fx.
		setDesiredZips(desiredZips)
		startSearchQuery()
	}

	// -------------
	// CITY RELATED SEARCH EFFECTS
	// -------------
	useEffect(() => {
		if (triggerSearch.current) {
			if (PlaceSearchError) {
				console.error('error with location search')
				setDesiredZips([])
			}
			if (placeSearchResult) {
				if (!placeSearchResult.results.length) {
					alert('No locations found for this city or zip. Searching all locations')
					setDesiredZipsAndSearch()
					triggerSearch.current = false
					return
				}

				//sort cities so that matching city is first, then tweeze out desired zips from results
				//api seems to fail shortly after 20 zips, so limit it to that
				const sortedMatchedCities = placeSearchResult.results.sort((a, b) => a.city === currentCity ? -1: b.city === currentCity ? 1 : 0)
				const zips = sortedMatchedCities.map(loc => loc.zip_code).slice(0,20)
				setDesiredZipsAndSearch(zips)
				triggerSearch.current = false
			}
		}
	}, [placeSearchResult, PlaceSearchError])

	// --------------
	// ZIP RELATED SEARCH EFFECTS
	// --------------
	useEffect(() => {
		if (triggerSearch.current) {
			if (locationError) {
				console.warn('error in searching zip location')
				setDesiredZips([])
				triggerSearch.current = false
				return 
			}

			if (locationResult) {
				if (!locationResult.length) {
					alert('No location matched your zip code, searching all locations.')
					setDesiredZipsAndSearch()
					triggerSearch.current = false
					return
				}

				const targetLocation = locationResult[0]
				const {latitude, longitude} = targetLocation
				const bounds = getBoundingBox(latitude, longitude, 20)
				setCurrentZipBounds(bounds)
			}
		}
	}, [locationResult, locationError])

	useEffect(() => {
		if (triggerSearch.current) {
			if (LocationSearchError) {
				console.error('error with location search')
				setDesiredZips([])
			}
			if (locationSearchResult) {
				if (!locationSearchResult.results) {
					alert('no locations found for search radius')
					setDesiredZipsAndSearch()
					triggerSearch.current = false
					return
				}

				//tweeze out desired zips from results
				//api seems to fail shortly after 20 zips, so limit it to that
				let zips = locationSearchResult.results.map(loc => loc.zip_code).slice(0,20)
				zips = [currentZip!, ...zips.filter(zip => zip !== currentZip)]
				setDesiredZipsAndSearch(zips)
			}
		}
	}, [locationSearchResult, LocationSearchError])

	// -------------
	// FORM HANDLING
	// -------------
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>({ 
		mode: "onSubmit",
		reValidateMode: "onSubmit"
	})

	const inputValue = watch("cityOrZip")

	//if user edits input but searches through a filter or some other way than main search button, we still need to keep track of this input, so monitor and update accordingly.
	useEffect(() => {
		setHasChanges(true)
	}, [inputValue])

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		setHasChanges(false)
		resetFavorites()
		const cityOrZip = data.cityOrZip.trim()

		const isZip = /^\d+$/.test(cityOrZip)
		if (!cityOrZip) {
			setCurrentCity(undefined)
			setCurrentZip(undefined)
			setDesiredZipsAndSearch()
		}

		if (isZip) {
			setCurrentCity(undefined)
			if (cityOrZip === currentZip) {
				return startSearchQuery()
			}
			setCurrentZip(cityOrZip)
		}
		else {
			setCurrentZip(undefined)
			setCurrentZipBounds(undefined)
			if (currentCity === cityOrZip) {
				return startSearchQuery()
			}
			setCurrentCity(cityOrZip)
		}

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
						{...register("cityOrZip", {
							required: false, 
							minLength: {
								value: 2,
								message: "Please enter a valid city or ZIP code"
							},
							pattern: {
								//matches EITHER all letters with spaces OR a 5-digit number with leading/trailing space allowed
								value: /^(?:[A-Za-z\s]+|\s*\d{5}\s*)$/,
								message: "Please enter a valid city or ZIP code"
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
							.replace(/[^A-Za-z\s\d\-.]/g, "") // Allow letters, numbers, dashes, periods
						}}
					/>
					{/* errors will return when field validation fails  */}
					{errors.cityOrZip && <span className="text-sm text-red-700">{errors.cityOrZip.message}</span>}
				</div>

				<span className="relative">
					<button 
						className={`relative z-1 flex justify-center items-center rounded-full px-10 hover:cursor-pointer ${theme.bgDark} text-white text-xl font-medium py-2 h-[35px] min-w-[220px]`} 
						type="submit">
						SEARCH
					</button>
					{hasChanges && <span className="absolute absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-3/4 w-3/5 animate-ping rounded-full bg-lime-700 opacity-75"></span>}
				</span>

			</div>

		</form>
	)
}


const EARTH_RADIUS_MILES = 3960
/**
 * Utility fx given by chatGPT to calculate the latitude and longitude bottom_left and upper_right bounds for a given location (lat & lon) and radius distance (in miles)
 */
function getBoundingBox(lat: number, lon: number, distance: number): Bounds {
	const toDegrees = (radians: number) => (radians * 180) / Math.PI;

	// Convert miles to degrees latitude
	const deltaLat = toDegrees(distance / EARTH_RADIUS_MILES);

	// Convert latitude to radians for longitude calculation
	const latRad = (lat * Math.PI) / 180;

	// Convert miles to degrees longitude (scaling by latitude)
	const deltaLon = toDegrees(distance / (EARTH_RADIUS_MILES * Math.cos(latRad)));

	const roundToSix = (val: number) => Math.round(val * 1000000) / 1000000;

	return {
		top_right: { lat: roundToSix(lat + deltaLat), lon: roundToSix(lon + deltaLon) },
		bottom_left: { lat: roundToSix(lat - deltaLat), lon: roundToSix(lon - deltaLon) },
	};
}