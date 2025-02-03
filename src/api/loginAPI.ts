import { useStoreState } from "@/appState/store"
import useSWRMutation from "swr/mutation"
import { poster, ROUTE } from "./apiBase"
import { useRouter } from "next/navigation"
import { mutate } from "swr"


type LoginBody = {
	name: string,
	email: string
}
export function useLogin() {
	const setIsLoggedIn = useStoreState(s => s.setIsLoggedIn)
	const router = useRouter()
	const {
		trigger,
		data,
		error,
		isMutating
	} = useSWRMutation(
		ROUTE.POST.LOGIN,
		poster<LoginBody>,
		{
			onSuccess: () => {
				setIsLoggedIn(true)
				//invalidate all keys to retrigger any failed GETs
				mutate(() => true, undefined, { revalidate: false });
				router.push('/search')
			}
		}
	)

	return {
		triggerLogin: trigger,
		data,
		error,
		isMutating
	}
}

export function useLogout() {
	const setIsLoggedIn = useStoreState( s => s.setIsLoggedIn )

	const {
		trigger,
		data,
		error,
		isMutating
	} = useSWRMutation<null>(
		ROUTE.POST.LOGOUT,
		poster,
		{
			onSuccess: () => {
				setIsLoggedIn(false)
			}
		}
	)

	return {
		triggerLogout: trigger,
		data,
		error,
		isMutating
	}
}