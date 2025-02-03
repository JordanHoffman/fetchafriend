import { Popover, PopoverButton, PopoverPanel, Checkbox } from '@headlessui/react'
import { BASE_QUERY, useGetBreeds } from '@/api/searchAPI'
import { useStoreState } from '@/appState/store'
import { useEffect } from 'react'

export const FilterResults = () => {
	const { breeds } = useGetBreeds()

	const filterBreeds = useStoreState(s => s.filterBreeds)
	const editBreed = useStoreState(s => s.editBreed)
	const clearBreedFilter = useStoreState(s => s.clearBreedFilter)

	const setCurrentSearchQuery = useStoreState(s => s.setCurrentSearchQuery)

	useEffect(() => {
		if (filterBreeds) {
			let queryBreeds = ''
			const keys = Object.keys(filterBreeds)
			let usedBreedsCount = 0
			for (let i = 0; i < keys.length; i++){
				//a bunch of encodeURIComponent in order to match the text of the api's returned cursors. This makes sure swr keys line up so that un-needed api calls are avoided when navigating back to previous page results.
				const key = keys[i]
				if (filterBreeds[key]) {
					if (!queryBreeds) queryBreeds = `breeds${encodeURIComponent(`[${usedBreedsCount}]`)}=${encodeURIComponent(key)}`
					else queryBreeds += `&breeds${encodeURIComponent(`[${usedBreedsCount}]`)}=${encodeURIComponent(key)}`
					usedBreedsCount++
				}
			}
			queryBreeds += `&${BASE_QUERY}`
			if (queryBreeds) {
				setCurrentSearchQuery(queryBreeds)
			}
			else {
				setCurrentSearchQuery(``)
			}
		}
	}, [filterBreeds])


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