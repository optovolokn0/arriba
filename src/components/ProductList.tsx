import React from "react";
import Product from '../components/Product'
import { IProductList } from "../models";

interface ProductListProps{
    productList: IProductList
}

const ProductList = (props: ProductListProps) => {
    return (
        <div>
            <h1 className='title'>{props.productList.title}</h1>
            <div className="list">
                {props.productList.list.map(elem => 
                    <Product product = {elem} key={elem.id}/>
                )}
            </div>
        </div>
    )
}

export default ProductList