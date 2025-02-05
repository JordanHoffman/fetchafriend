import { useGetBreeds } from "@/api/searchAPI"
import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import { Checkbox, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"

export const BreedsFilter = () => {
	const { breeds } = useGetBreeds()

	const filterBreeds = useStoreState(s => s.filterBreeds)
	const editBreed = useStoreState(s => s.editBreed)
	const clearBreedFilter = useStoreState(s => s.clearBreedFilter)

	return (
		<Popover className="relative">
			<PopoverButton
				className={`${theme.border} ${theme.bg} font-medium text-xl border-4 rounded-full px-4 flex gap-3 items-center`}
			>
				Breeds
				{/* settings sgv */}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
				</svg>

			</PopoverButton>
			<PopoverPanel anchor="bottom start" className={`flex flex-col m-1 rounded-3xl ${theme.border} border-4`}>
				<button
					onClick={clearBreedFilter}
					className={`${theme.bgDark} text-white pb-1 text-lg font-medium`}
				>
					Clear
				</button>
				{!!breeds?.result && breeds.result.map( breed => {
					const shouldFilter = filterBreeds ? !!filterBreeds[breed] : false
					return (
						<Checkbox
							checked={shouldFilter}
							onChange={checked => editBreed(breed, checked)}
							className={`flex justify-between items-center gap-3 px-2 py-2 ${theme.border} border-b-1 bg-lime-50`}
							key={breed}
						>
							<span className="flex flex-wrap">
								{breed}
							</span>
							<div
								className={`w-[20px] h-[20px] rounded-full flex justify-center items-center ${theme.bgDark}`}
							>
								{shouldFilter && <div className={`w-[12px] h-[12px] rounded-full bg-amber-100`}/>}
							</div>
						</Checkbox>
					)
				})}
			</PopoverPanel>
		</Popover>
	)
}