import { AgeFilter } from './ageFilter'
import { BreedsFilter } from './breedsFilter'

export const FilterTool = ({ className = "" }: {className?: string}) => {

	return (
		<div className={className}>
			<h3
				className="text-xl font-medium mb-2"
			>
				Filter By Breed & Age
			</h3>
			<div
				className='flex flex-wrap gap-3'
			>
				<BreedsFilter />
				<AgeFilter />
			</div>
		</div>
	)
}