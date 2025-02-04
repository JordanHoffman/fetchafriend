import { MAX_AGE, MIN_AGE, useStoreState } from "@/appState/store"
import { Slider, SliderValueChangeDetails } from "@ark-ui/react"



export const AgeFilter = () => {

	const minAge = useStoreState(s => s.minAge)
	const setMinAge = useStoreState(s => s.setMinAge)
	const maxAge = useStoreState(s => s.maxAge)
	const setMaxAge = useStoreState(s => s.setMaxAge)

	const handleValueChange = (details: SliderValueChangeDetails) => {
		const [minVal, maxVal] = details.value
		setMinAge(minVal)
		setMaxAge(maxVal)
	}

	const handleUpdateQuery = () => {

	}

	return (
    <Slider.Root 
			className="border-2 border-black min-w-3xs flex flex-col p-2"
			defaultValue={[MIN_AGE, MAX_AGE]}
			min={MIN_AGE}
			max={MAX_AGE}      
			onValueChange={handleValueChange}
		>
			<div className="flex justify-between items-center">
				<div>
					<Slider.Label>Age</Slider.Label>
					<span>
						From {minAge} to {maxAge}
					</span>
				</div>
				<button 
					className="rounded-full w-[75px] border-2 border-black"
					onClick={handleUpdateQuery}
				>
					Go
				</button>
			</div>


      <Slider.Control
				className="flex items-center h-[50px]"
			>
        <Slider.Track
					className="h-[4px] bg-black w-full"
				>
          <Slider.Range className="h-[4px] bg-black"/>
        </Slider.Track>
        <Slider.Thumb 
					className="w-[20px] h-[20px] rounded-full bg-black"
					index={0}
				>
          <Slider.HiddenInput />
        </Slider.Thumb>
				<Slider.Thumb 
					className="w-[20px] h-[20px] rounded-full bg-black"
					index={1}
				>
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
	)
}