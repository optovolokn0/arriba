export interface IProduct{
    id: number,
    product_id: number,
    product_name: string,
    product_price: number,
    product_description: string,
    characteristics: ICharacteristics[],
    images: IImage[],
    category: number,
    brand: number,
    seller: number,
}

export interface IImage{
    id: number,
    image: string,
    product: number
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

export interface IBasket {
    id: number,
    user: number,
    products: IBasketProduct[]
}

export interface IBasketProduct {
    product: number,
    product_name: string,
    quantity: number
}