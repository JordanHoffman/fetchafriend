import { MAX_AGE, MIN_AGE, useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import { Slider, SliderValueChangeDetails } from "@ark-ui/react"

export const AgeFilter = () => {
	const minAge = useStoreState(s => s.minAge)
	const setMinAge = useStoreState(s => s.setMinAge)
	const maxAge = useStoreState(s => s.maxAge)
	const setMaxAge = useStoreState(s => s.setMaxAge)
	const startSearchQuery = useStoreState(s => s.startSearchQuery)

	const handleValueChange = (details: SliderValueChangeDetails) => {
		const [minVal, maxVal] = details.value
		setMinAge(minVal)
		setMaxAge(maxVal)
	}

	return (
    <Slider.Root 
			className={`w-full min-w-[200px] max-w-[250px] flex flex-col p-3 pb-5 ${theme.border} border-2 rounded-2xl`}
			defaultValue={[MIN_AGE, MAX_AGE]}
			min={MIN_AGE}
			max={MAX_AGE}      
			onValueChange={handleValueChange}
		>
			<div className="flex gap-8 items-center mb-5">
				<div className="flex gap-2 items-end">
					<Slider.Label
						className="text-xl font-medium"
					>
						Age:
					</Slider.Label>
					<span
						className="text-lg font-medium whitespace-nowrap"
					>
						{minAge} to {maxAge}
					</span>
				</div>
				<button 
					className={`rounded-full w-[75px] border-2 text-lg font-medium ${theme.bgDark} text-white`}
					onClick={() => startSearchQuery()}
				>
					Go!
				</button>
			</div>


      <Slider.Control
				className="flex items-center"
			>
        <Slider.Track
					className={`h-[4px] w-full ${theme.bgDark}`}
				>
          <Slider.Range className={`h-[4px] ${theme.bgDark}`}/>
        </Slider.Track>
        <Slider.Thumb 
					className={`w-[20px] h-[20px] rounded-full relative ${theme.bgDark}`}
					index={0}
				>
					<div className={`w-[12px] h-[12px] rounded-full absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-100`} />
          <Slider.HiddenInput />
        </Slider.Thumb>
				<Slider.Thumb 
					className={`w-[20px] h-[20px] rounded-full relative ${theme.bgDark}`}
					index={1}
				>
					{/* <div className={`w-[12px] h-[12px] rounded-full absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-100`} /> */}
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
	)
}