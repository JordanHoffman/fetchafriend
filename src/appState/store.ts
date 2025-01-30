import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type StoreState = {
	isLoggedIn: boolean,
	setIsLoggedIn: (newVal: boolean) => void
}

export const useStoreState = create<StoreState>()(
	immer(
		(set) => ({
			isLoggedIn: false,
			setIsLoggedIn: newVal => set(() => ({ isLoggedIn: newVal }))
		})
	)
)
