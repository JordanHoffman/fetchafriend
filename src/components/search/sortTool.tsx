import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { SortTypes, useStoreState } from "@/appState/store"

export const SORT_OPTIONS: Record<SortTypes, string> = {
	"breed:asc": "breed: A to Z",
	"breed:desc": "breed: Z to A",
	"name:asc": "name: A to Z",
	"name:desc": "name: Z to A",
	"age:asc": "age: youngest",
	"age:desc": "age: oldest"
}

export const SortTool = () => {
	const setSortBy = useStoreState(s => s.setSortBy)

	return (
				<Popover className="relative bg-white">
					<PopoverButton>Sort By:</PopoverButton>
					<PopoverPanel anchor="bottom" className="flex flex-col">
						{
							Object.entries(SORT_OPTIONS).map(sortItem => {
								const query = sortItem[0] as SortTypes
								const desc = sortItem[1]
								return (
									<button
										onClick={() => setSortBy(query)}
										key={query}
									>
										{desc}
									</button>
								)
							})
						}
					</PopoverPanel>
				</Popover>
	)
}