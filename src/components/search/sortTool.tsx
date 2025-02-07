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
export const SORT_GROUPS: Record<string, {
		ascElement: ReactNode, 
		descElement: ReactNode, 
		ascQuery: SortTypes, 
		descQuery: SortTypes
}> = {
	breed: {
		ascElement: <span className={sortStyle}>Breed <ArrowUp /></span>,
		descElement: <span className={sortStyle}>Breed <ArrowDown /></span>,
		ascQuery: "breed:asc",
		descQuery: "breed:desc"
	},
	name: {
		ascElement: <span className={sortStyle}>Name <ArrowUp /></span>,
		descElement: <span className={sortStyle}>Name <ArrowDown /></span>,
		ascQuery: "name:asc",
		descQuery: "name:desc"
	},
	age: {
		ascElement: <span className={sortStyle}>Age <ArrowUp /></span>,
		descElement: <span className={sortStyle}>Age <ArrowDown /></span>,
		ascQuery: "age:asc",
		descQuery: "age:desc"
	}
}

export const SortTool = ({ className = "" }: {className?: string}) => {
	const setSortBy = useStoreState(s => s.setSortBy)
	const sortByQuery = useStoreState(s => s.sortByQuery)

	return (
		<div className={`flex flex-col items-start ${className} lg:min-w-[450px]`}>
			<h3
				className="text-xl font-medium text-center md:text-start mb-1"
			>
				Sort By:
			</h3>
			<div className='flex flex-wrap gap-3'>
				{Object.entries(SORT_GROUPS).map(sortInfo => {
					const category = sortInfo[0]
					const {ascElement, descElement, ascQuery, descQuery} = sortInfo[1]
					const ascCacheFormat = "sort=" + ascQuery.split(":").join("%3A")
					const descCacheFormat = "sort=" + descQuery.split(":").join("%3A")

					const isAscChosen = sortByQuery === ascCacheFormat
					const isDescChosent = sortByQuery === descCacheFormat

					const ascStyling = isAscChosen ? `${theme.bgDark} text-white` : `${theme.bg}`
					const descStyling = isDescChosent ? `${theme.bgDark} text-white` : `${theme.bg}`
					const btnStyling = `${theme.border} border-2 font-medium text px-3 rounded-full min-w-[100px] flex justify-center`

					return (
						<div 
							key={category} 
							className="flex flex-row min-[450px]:flex-col gap-3"
						>
							<button
								className={`${ascStyling} ${btnStyling}`}
								onClick={() => setSortBy(ascQuery)}
							>
								{ascElement}
							</button>
							<button
								className={`${descStyling} ${btnStyling}`}
								onClick={() => setSortBy(descQuery)}
							>
								{descElement}
							</button>
						</div>
					)
				})}
			</div>

		</div>
	)
}