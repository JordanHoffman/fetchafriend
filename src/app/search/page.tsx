'use client'

import { useGetSearch } from "@/api/api"
import { useEffect } from "react"

export default function SearchPage() {
	const { searchResult } = useGetSearch()

	useEffect(() => {
		console.log('new search result', searchResult)
	}, [searchResult])
	return (
		<div>
			<button>
				search
			</button>

		</div>
	)
}