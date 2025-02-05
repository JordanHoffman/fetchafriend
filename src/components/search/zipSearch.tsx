import { Bounds, useZipLocation } from "@/api/searchAPI"
import { useStoreState } from "@/appState/store"
import { useEffect, useRef, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
type Inputs = {
	zip: string
}
export const ZipSearch = () => {
	const [currentZip, setCurrentZip] = useState("")
	const { locationResult, error: locationError } = useZipLocation(currentZip)
	const startSearchQuery = useStoreState(s => s.startSearchQuery)
	const setDesiredZips = useStoreState(s => s.setDesiredZips)

	const triggerSearch = useRef(false) 

	useEffect(() => {
		if (triggerSearch.current) {
			if (locationError) {
				console.warn('error in searching zip location')
				setDesiredZips([])
				triggerSearch.current = false
			}
			if (locationResult) {
				if (!locationResult.length) {
					alert('No location matched your zip code, searching all locations.')
					setDesiredZips([])
					triggerSearch.current = false
				}
				else {
					const targetLocation = locationResult[0]
					const {latitude, longitutde} = targetLocation
					const bounds = getBoundingBox(latitude, longitutde, 25)

				}
			}
		}
	}, [locationResult, locationError])

	const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ 
		mode: "onSubmit",
		reValidateMode: "onSubmit"
	})

	// const zip = watch("zip")

	// useEffect(() => {
	// 	console.log('zip', zip)
	// 	if (zip.length === 5) {
	// 		currentZip.current = zip
	// 	}
	// 	else {
	// 		currentZip.current = ""
	// 	}
	// }, [zip])

  const onSubmit: SubmitHandler<Inputs> = (data) => {
		//user pressed search with same zip. It's possible they changed other settings elsewhere, so just trigger a fresh search
		if (currentZip === data.zip) {
			return startSearchQuery()
		}

		//different zip value... begin multi-stage process to get desired zip list
		setCurrentZip(data.zip)
		triggerSearch.current = true
	}

	return (
    <form
			className="flex"
			onSubmit={handleSubmit(onSubmit)}
		>
      <div
				className="flex flex-col"
			>
				<input 
					{...register("zip", {
						required: false, 
						pattern: {
							value: /^\d{5}$/,
      				message: "Please enter valid ZIP or leave empty"
						}
					})}
					placeholder="All Locations"
					type="text"
					maxLength={5}
					inputMode="numeric"
					onInput={(e) => {
						//force only numeric input
						const target = e.target as HTMLInputElement
						target.value = target.value.replace(/\D/g, "")}
					}
				/>
				{/* errors will return when field validation fails  */}
				{errors.zip && <span>{errors.zip.message}</span>}
			</div>


      <input type="submit" />
    </form>
	)
}

// Utility fx given by chatGPT for getting specific radius bounds from give lat/long point.

const EARTH_RADIUS_MILES = 3960
// Function to calculate the latitude and longitude changes for a given distance (in miles)
function getBoundingBox(lat: number, lon: number, distance: number): Bounds {
  // Calculate latitude change
  const deltaLat = distance / EARTH_RADIUS_MILES
  
  // Convert latitude to radians for the cosine calculation
  const latRad = (lat * Math.PI) / 180
  
  // Calculate longitude change, adjusting for latitude
  const deltaLon = distance / (EARTH_RADIUS_MILES * Math.cos(latRad))

	const roundToSix = (val: number) => {
		return Math.round(val * 1000000) / 1000000
	}

  // Calculate top-right and bottom-left coordinates
  const topRightLat = roundToSix(lat + deltaLat)
  const topRightLon = roundToSix(lon + deltaLon)
  const bottomLeftLat = roundToSix(lat - deltaLat)
  const bottomLeftLon = roundToSix(lon - deltaLon)

  return {
    top_right: { lat: topRightLat, lon: topRightLon },
    bottom_left: { lat: bottomLeftLat, lon: bottomLeftLon }
  };
}