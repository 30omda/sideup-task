import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const baseURL = import.meta.env.VITE_API_URL

const fetchCategories = async () => {
    const result = await axios.get(`${baseURL}/products/categories`)
    return result.data
}

export default function useGetCategories() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    })
    return {
        categories: data ?? [],
        isLoading,
        isError,
        error,
    }
}
