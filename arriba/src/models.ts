export interface IProduct{
    id: number,
    product_id: number,
    product_name: string,
    product_price: number,
    product_description: string,
    characteristics: ICharacteristics[],
    category: number,
    brand: number,
    seller: number,
}

export interface ICharacteristics{
    id: number,
    name: string,
    value: string
}

export interface IBrand{
    brand_id: number,
    brand_name: string
}

export interface ICategory{
    category_id: number,
    category_name: string
}

export interface IProductsList{
    category_id: number,
    list: IProduct[]
}

export interface ICategoryPageProps {
    products: IProduct[],
    categories: ICategory[]
}

export interface IUser {
    id: number,
    name: string,
    email: string,
    role: string,
    role_id: string
}