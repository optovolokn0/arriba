export interface IProduct{
    id: number,
    name: string,
    photo: string,
    price: number,
    category_id: number
}

export interface ICategory{
    id: number,
    name: string,
    slug: string, //человеческий url
    parentId?: number //для вложенных категорий 
}

export interface IProductsList{
    category_id: number,
    list: IProduct[]
}

export interface ICategoryPageProps {
    products: IProduct[];
    categories: ICategory[];
}