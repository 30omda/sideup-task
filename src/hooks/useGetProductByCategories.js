import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const baseURL = import.meta.env.VITE_API_URL

const fetchProductsByCategory = async (categoryName) => {
  const result = await axios.get(`${baseURL}/products/category/${categoryName}`)
  return result.data
}

export default function useGetProducts(categoryName) {
  return useQuery({
    queryKey: ["productsbyCategories", categoryName],
    queryFn: () => fetchProductsByCategory(categoryName),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  })
}
