'use client'

import { useGetBreeds } from "@/api/api"
import { useEffect } from "react"

export const Hello = () => {
	const { breeds } = useGetBreeds()
	useEffect(() => {
		console.log('breeds: ', breeds)
	}, [breeds])
	return (
		<div>
			Hi.
		</div>
	)
}
