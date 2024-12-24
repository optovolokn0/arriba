
import { IProduct } from "../../models";
import apiClient from "../apiClient";

//категории

export const createCategoryData = async (categoryName: string) => {
    const data = await apiClient.post('api/categories/', {category_name: categoryName})
    return data
}

export const fetchCategoriesData = async () => {
    const data = await apiClient.get(`api/categories/`)
    return data
}

export const deleteCategoriesData = async (id: number) => {
    return await apiClient.delete(`api/categories/${id}/`)
}

//бренды

export const createBrandData = async (brandName: string) => {
    const data = await apiClient.post('api/brands/', {brand_name: brandName})
    return data
}

export const fetchBrandsData = async () => {
    const data = await apiClient.get(`api/brands/`)
    return data
}

export const deleteBrandsData = async (id: number) => {
    return await apiClient.delete(`api/brands/${id}/`)
}

//корзина

export const createBasketData = async (userId: number) => {
    return await apiClient.post(`api/basket/`, {user: userId})
} 

export const fetchUserBasketData = async (userId: number)=> {
    return await apiClient.get(`api/basket/user/${userId}/`)
}

export const addToUserBasketData = async (userId: number, productId: number | undefined, _quantity: number) => {
    return await apiClient.post(`api/basket/user/${userId}/`, {product_id: productId, quantity: _quantity})
}

export const deleteFromBasketData = async (userId: number, productId: number) => {
    return await apiClient.delete(`api/basket/user/${userId}/`, {data: {product_id: productId}})
}

//товары

export const fetchProductsData = async () => {
    const data = await apiClient.get(`api/products/`)
    return data
}

export const fetchProduct = async (productId: number): Promise<IProduct> => {
    const response = await apiClient.get(`api/products/${productId}/`)
    return response.data
}

export const createProductData = async (name: string, price: string, descr: string, characteristics: [], seller_id: number, brand_id: number, category_id: number)=>{
    const data = await apiClient.post('api/products/', 
    {
        product_name: name,
        product_price: price,
        product_description: descr,
        characteristics: characteristics,
        seller: seller_id,
        brand: brand_id,
        category: category_id
    })
    return data
}

export const deleteProductData = async (id: number) => {
    return await apiClient.delete(`api/products/${id}/`)
}

//характеристики

export const createCharacteristic = async (id: number, characteristic: { name: string; value: string }) => {
    return await apiClient.post(`api/products/${id}/add_characteristic/`, { name: characteristic.name, value: characteristic.value})
}

//отзывы

export const fetchProductReviews = async (product_id: number) => {
    return await apiClient.get(`api/reviews/${product_id}/`)
}

export const addProductReview = async (product_id: number) => {
    return await apiClient.post(`api/reviews/${product_id}/`)
}
