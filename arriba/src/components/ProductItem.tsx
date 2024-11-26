import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { IProduct } from "../models";
import { useNavigate } from "react-router-dom";
import { PRODUCT_ROUTE } from "../utils/consts";
import { Context } from "../main";

interface ProductProps {
    productItem: IProduct
}

const ProductItem = observer((item: ProductProps) => {
    const history = useNavigate()
    const { product } = useContext(Context)!

    return (
        <div className="product" onClick={() => history(PRODUCT_ROUTE + '/' + item.productItem.id)}>
            <img src={item.productItem.photo} alt="" />
            <span>{item.productItem.price} ₽</span>
            <span>{item.productItem.name}</span>
            <button onClick={()=>product.addToBasket(item.productItem)} className="btn product-buy-btn">Купить</button>
        </div>
    )
})

export default ProductItem