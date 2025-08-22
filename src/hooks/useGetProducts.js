import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const baseURL = import.meta.env.VITE_API_URL

const fetchAllProducts = async () => {
    const result = await axios.get(`${baseURL}/products`)
    return result.data
}

export default function useGetProducts() {
    return useQuery({
        queryKey: ["products"], 
        queryFn: fetchAllProducts,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    })
}
