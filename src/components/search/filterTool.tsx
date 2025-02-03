import { Popover, PopoverButton, PopoverPanel, Checkbox } from '@headlessui/react'
import { useGetBreeds } from '@/api/searchAPI'
import { useStoreState } from '@/appState/store'

export const FilterTool = () => {
	const { breeds } = useGetBreeds()

	const filterBreeds = useStoreState(s => s.filterBreeds)
	const editBreed = useStoreState(s => s.editBreed)
	const clearBreedFilter = useStoreState(s => s.clearBreedFilter)

	return (
		<Popover className="relative bg-white">
			<PopoverButton>Breeds</PopoverButton>
			<PopoverPanel anchor="bottom" className="flex flex-col">
				<button
					onClick={clearBreedFilter}
					className='bg-white'
				>
					Clear
				</button>
				{!!breeds?.result && breeds.result.map( breed => {
					const shouldFilter = filterBreeds ? !!filterBreeds[breed] : false
					return (
						<div
							className='flex justify-between bg-white'
							key={breed}
						>
							<span>
								{breed}
							</span>
							<Checkbox
								checked={shouldFilter}
								onChange={checked => editBreed(breed, checked)}
								className={`w-[15px] h-[15px] rounded-full border-2 border-black flex justify-center align-center`}
							>
								{shouldFilter && <div className='w-[12px] h-[12px] rounded-full bg-green-300'/>}
							</Checkbox>
						</div>
					)
				})}
			</PopoverPanel>
		</Popover>
	)
}