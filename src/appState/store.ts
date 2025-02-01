import { type Dog } from "@/api/api";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type StoreState = {
	isLoggedIn: boolean,
	setIsLoggedIn: (newVal: boolean) => void,
	currentDogPageList: Dog[],
	setCurrentDogPageList: (newVal: Dog[]) => void,
	currentSearchQuery: string,
	setCurrentSearchQuery: (newVal: string) => void,
}

export const useStoreState = create<StoreState>()(
	immer(
		(set) => ({
			isLoggedIn: false,
			setIsLoggedIn: newVal => set(() => ({ isLoggedIn: newVal })),
			currentDogPageList: [],
			setCurrentDogPageList: newVal => set(() => ({ currentDogPageList: newVal})),
			currentSearchQuery: "",
			setCurrentSearchQuery: newVal => set(() => ({ currentSearchQuery: newVal}))
		})
	)
)
