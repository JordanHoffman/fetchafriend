import { useStoreState } from '@/appState/store'
import { Pagination } from '@ark-ui/react/pagination'
import { useState } from 'react'

export const Paginator = ({
	prevQuery, 
	nextQuery,

}:{
	prevQuery?: string,
	nextQuery?: string,
}) => {
	const setCurrentSearchQuery = useStoreState(s => s.setCurrentSearchQuery)
	const startSearchQuery = useStoreState(s => s.startSearchQuery)
	const totalResults = useStoreState(s => s.totalResults)
	const [currentPage, setCurrentPage] = useState(1)

	if (!totalResults) return null

	const pageButtonStyle = 'min-w-[40px] h-[40px] px-1 py-1 border-1 border-black flex items-center justify-center'

	const handlePageChange = (details: Pagination.PageChangeDetails) => {
		const { page } = details
		setCurrentPage(page)
		const isNextPage = page === currentPage + 1
		const isPrevPage = page === currentPage - 1
		if (isNextPage && nextQuery) {
			setCurrentSearchQuery(nextQuery)
		}
		else if (isPrevPage && prevQuery) {
			setCurrentSearchQuery(prevQuery)
		}
		else {
			startSearchQuery(page)
		}
	}

	return (
		<Pagination.Root 
			count={totalResults} 
			pageSize={25} 
			siblingCount={2}
			className='flex gap-1'
			page={currentPage}
			onPageChange={handlePageChange}
		>
			<Pagination.PrevTrigger
				className={`${pageButtonStyle} rounded-l-lg gap-1`}
			>
				<svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
					<path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
				</svg>

				Prev
			</Pagination.PrevTrigger>
			<Pagination.Context>
				{(pagination) =>
					pagination.pages.map((page, index) =>
						page.type === 'page' ? (
							<Pagination.Item 
								key={index} {...page}
								className={`${pageButtonStyle} rounded-lg ${page.value === currentPage ? 'bg-green-100' : ''}`}
							>
								{page.value}
							</Pagination.Item>
						) : (
							<Pagination.Ellipsis 
								key={index} 
								index={index}
								className='flex items-end'
							>
								&#8230;
							</Pagination.Ellipsis>
						),
					)
				}
			</Pagination.Context>
			<Pagination.NextTrigger
				className={`${pageButtonStyle} rounded-r-lg gap-1`}
			>
				Next
				<svg className="size-5" viewBox="0 0 20 20" fill="black" aria-hidden="true" data-slot="icon">
					<path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
				</svg>
			</Pagination.NextTrigger>
		</Pagination.Root>
	)
}