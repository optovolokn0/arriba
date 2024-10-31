import React from "react";
import { IProduct } from "../models";

interface ProductProps{
    product: IProduct
}

const Product = (props: ProductProps) => {
    
    function deleteProduct(){
       
    }

    return (
        <div className="product" id={props.product.id.toString()}>
            <div className="product_content">
                <strong className='product_name'>{props.product.title}</strong>
                <p className="product_descr">{props.product.descr}</p>
                <p className="product_price">{props.product.price} р.</p>
            </div>
            <div className="product_btns">
                <button className="delete" onClick={deleteProduct}>Удалить</button>
            </div>
        </div>
    )
}

export default Product