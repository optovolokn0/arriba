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

export interface ICategory{
    id: number,
    name: string
}

export interface IProductsList{
    category_id: number,
    list: IProduct[]
}

export interface ICategoryPageProps {
    products: IProduct[],
    categories: ICategory[]
}
