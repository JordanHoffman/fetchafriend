import { type Dog } from "@/api/apiBase";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type StoreState = {
	isLoggedIn: boolean,
	setIsLoggedIn: (newVal: boolean) => void,
	currentDogPageList: Dog[],
	setCurrentDogPageList: (newVal: Dog[]) => void,

	//Search Query
	currentSearchQuery: string | undefined,
	setCurrentSearchQuery: (newVal: string) => void,
	totalResults: number,
	setTotalResults: (newVal: number) => void

	//Filtering
	filterBreeds: Record<string, boolean> | undefined
	editBreed: (breed: string, newVal: boolean) => void
	clearBreedFilter: () => void

	//Sorting
}

export const useStoreState = create<StoreState>()(
	immer(
		set => ({
			isLoggedIn: false,
			setIsLoggedIn: newVal => set(() => ({ isLoggedIn: newVal })),
			currentDogPageList: [],
			setCurrentDogPageList: newVal => set(() => ({ currentDogPageList: newVal})),


			currentSearchQuery: undefined,
			setCurrentSearchQuery: newVal => set(() => ({ currentSearchQuery: newVal})),
			totalResults: 0,
			setTotalResults: newVal => set(() => ({ totalResults: newVal })),


			filterBreeds: undefined,
			editBreed: (breed, newVal) => set(state => {
				if (!state.filterBreeds) {
					state.filterBreeds = { [breed]: newVal }
				}
				else state.filterBreeds[breed] = newVal
			}),
			clearBreedFilter: () => set(() => ({ filterBreeds: {} }))
		})
	)
)
