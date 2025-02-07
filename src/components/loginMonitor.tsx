'use client'

import { useGetBreeds } from "@/api/searchAPI"
import { useStoreState } from "@/appState/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const LoginMonitor = () => {
	const { breeds, error } = useGetBreeds()
	const router = useRouter()
	const setIsLoggedIn = useStoreState(s => s.setIsLoggedIn)
	const isLoggedIn = useStoreState(s => s.isLoggedIn)

	useEffect(() => {
		if (error && error.status === 401) {
			setIsLoggedIn(false)
			if (window.location.pathname.includes('/search')) {
				router.replace('/?expired=true')
			}
		}
		else if (breeds?.result?.length) {
			setIsLoggedIn(true)
		}
	}, [breeds, error, setIsLoggedIn, router])

	useEffect(() => {
		if (isLoggedIn === false && window.location.pathname.includes('/search')) {
			router.replace('/')
		}
	}, [isLoggedIn, router])

	return null
}