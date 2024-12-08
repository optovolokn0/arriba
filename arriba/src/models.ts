export interface IProduct{
    id: number,
    name: string,
    photo: string,
    price: number,
    category_id: number,
    description: IInfo[]
}

export interface IInfo{
    id: number,
    title: string,
    descr: string
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