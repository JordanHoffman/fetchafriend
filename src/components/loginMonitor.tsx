'use client'

import { useGetBreeds } from "@/api/api"
import { useStoreState } from "@/appState/store"
import { useEffect } from "react"

export const LoginMonitor = () => {
	const { breeds, error } = useGetBreeds()
	const setIsLoggedIn = useStoreState(s => s.setIsLoggedIn)
	useEffect(() => {
		if (error && error.status === 401) {
			setIsLoggedIn(false)
		}
		else if (breeds?.result?.length) {
			setIsLoggedIn(true)
		}
	}, [breeds, error, setIsLoggedIn])

	return null
}