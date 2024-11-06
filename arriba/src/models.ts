export interface IProduct{
    id: number,
    title: string,
    descr: string,
    price: number
}

export interface IProductList{
    id: number,
    title: string,
    list: IProduct[]
}