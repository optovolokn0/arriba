import { IProductList } from "../models";
import { products } from "./productsData";

export const productList: IProductList[] = [
    {
        id: 1,
        title: 'FirstTitle',
        list: products.slice(0,2)
    },
    {
        id:2,
        title: 'weqqwe',
        list: products.slice(2,4)
    },
    {
        id:3,
        title: 'Test3',
        list: products.reverse()
    }
]