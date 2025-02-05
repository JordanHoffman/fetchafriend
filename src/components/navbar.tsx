'use client'

import { useLogout } from "@/api/loginAPI"
import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
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
			className={`flex gap-3 justify-between items-center ${theme.border} ${theme.bg} border-8 px-4 py-2 rounded-4xl mt-3`}
		>
			<span className={`text-3xl md:text-4xl font-bold`}>
				Fetch a Friend
			</span>

			<button 
				onClick={isLoggedIn ? handleLogout : handleLogin}
				className="border-4 px-3 py-1 rounded-full font-medium"
			>
				{isLoggedIn ? 'Logout' : 'Login'}
			</button>
		</nav>
	)
}