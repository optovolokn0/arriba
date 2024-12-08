import apiClient from "../apiClient";

export const createCategoryData = async (categoryName: string) => {
    const data = await apiClient.post('api/categories/', {category_name: categoryName})
    return data
}

export const fetchCategoriesData = async () => {
    const data = await apiClient.get(`api/categories/`)
    return data
}

export const createBrandData = async (brandName: string) => {
    const data = await apiClient.post('api/brands/', {brand_name: brandName})
    return data
}

export const fetchBrandsData = async () => {
    const data = await apiClient.get(`api/brands/`)
    return data
}

export const fetchProductsData = async () => {
    const data = await apiClient.get(`api/products/`)
    return data
}