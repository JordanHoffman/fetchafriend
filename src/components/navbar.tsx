'use client'

import { useLogout } from "@/api/loginAPI"
import { useStoreState } from "@/appState/store"
import { useRouter } from "next/navigation"

export const NavBar = () => {
	const router = useRouter()
	const { triggerLogout } = useLogout()
	const handleLogin = () => {
		router.push('/login')
	}

	const handleLogout = () => {
		triggerLogout()
	}

	const isLoggedIn = useStoreState(s => s.isLoggedIn)

	return (
		<nav
			className="flex gap-3"
		>
			{!isLoggedIn ? 
				<button onClick={handleLogin}>
					Login
				</button> :
				<button onClick={handleLogout}>
					Logout
				</button>
			}
		</nav>
	)
}