import {$authHost, $host} from "./index";

export const createCategory = async (category) => {
    const {data} = await $authHost.post('api/categories/', category)
    return data
}

export const fetchCategories = async () => {
    const {data} = await $host.get('api/categories/')
    return data
}

export const createBrand = async (brand) => {
    const {data} = await $authHost.post('api/brands/', brand)
    return data
}

export const fetchBrands = async () => {
    const {data} = await $host.get('api/brands/', )
    return data
}

export const createProduct = async (product) => {
    const {data} = await $authHost.post('api/products/', product)
    return data
}

// export const fetchProducts = async (typeId, brandId, page, limit= 5) => {
//     const {data} = await $host.get('api/products/', {params: {
//             typeId, brandId, page, limit
//         }})
//     return data
// }

export const fetchOneProduct = async (id) => {
    const {data} = await $host.get('api/products/' + id)
    return data
}