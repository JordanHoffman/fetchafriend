import { useFavoritesSearch, useGetDogsById, useGetSearch, useLocationSearch, usePlaceSearch, useZipLocation } from "@/api/searchAPI"
import { useStoreState } from "@/appState/store"

export const useIsLoading = () => {
	//general search related
	const currentSearchQuery = useStoreState(s => s.currentSearchQuery)
	const { searchResult, isLoading: isLoadingSearchQuery } = useGetSearch(currentSearchQuery)
	const { isLoading: isLoadingDogsResult } = useGetDogsById(searchResult?.result?.resultIds)

	//city related searching
	const currentCity = useStoreState(s => s.currentCity)
	const { isLoading: isLoadingCity } = usePlaceSearch(currentCity)

	//zip related searching
	const currentZip = useStoreState(s => s.currentZip)
	const currentZipBounds = useStoreState(s => s.currentZipBounds)
	const { isLoading: isLoadingZipLocation } = useZipLocation(currentZip)
	const { isLoading: isLoadingZipBounds } = useLocationSearch(currentZipBounds)

		const { isMutating: isFindingFavorite } = useFavoritesSearch()

	return isLoadingSearchQuery || isLoadingDogsResult || isLoadingCity || isLoadingZipLocation || isLoadingZipBounds || isFindingFavorite
}