import { useStoreState } from "@/appState/store"

export const SortTool = () => {
	const setSortBy = useStoreState(s => s.setSortBy)

	return (
		<div>
			<button
				onClick={() => setSortBy("breed:asc")}
			>
				breed ascending
			</button>
			<button
				onClick={() => setSortBy("breed:desc")}
			>
				breed descending
			</button>
		</div>
	)
}