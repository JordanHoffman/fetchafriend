import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { SortTypes, useStoreState } from "@/appState/store"
import { theme } from '@/theme'
import { ReactNode } from 'react'

const ArrowUp = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
</svg>

const ArrowDown = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5">
	<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
</svg>




const sortStyle = 'flex items-center'
export const SORT_OPTIONS: Record<SortTypes, string | ReactNode> = {
	"breed:asc": <span className={sortStyle}>Breed <ArrowUp /></span>,
	"breed:desc": <span className={sortStyle}>Breed <ArrowDown /></span>,
	"name:asc": <span className={sortStyle}>Name <ArrowUp /></span>,
	"name:desc": <span className={sortStyle}>Name <ArrowDown /></span>,
	"age:asc": <span className={sortStyle}>Age <ArrowUp /></span>,
	"age:desc": <span className={sortStyle}>Age <ArrowDown /></span>,
}

export const SortTool = ({ className = "" }: {className?: string}) => {
	const setSortBy = useStoreState(s => s.setSortBy)
	const sortByQuery = useStoreState(s => s.sortByQuery)

	return (
		<div className={`flex flex-col items-start ${className}`}>
			<h3
				className="text-xl font-medium text-center md:text-start mb-1"
			>
				Sort By:
			</h3>
			<div className='flex flex-wrap gap-3'>
				{Object.entries(SORT_OPTIONS).map(sortItem => {
					const query = sortItem[0] as SortTypes
					const desc = sortItem[1]
					const queryFormat = "sort=" + query.split(":").join("%3A")
					const isChosen = sortByQuery === queryFormat
					const styling = isChosen ? `${theme.bgDark} text-white` : `${theme.bg}`
					return (
						<button
							className={`${styling} ${theme.border} border-2 font-medium text px-3 rounded-full min-w-[100px] flex justify-center`}
							onClick={() => setSortBy(query)}
							key={query}
						>
							{desc}
						</button>
					)
				})}
			</div>

		</div>
	)

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