import React, { useContext } from "react";
import { IProduct } from "../models";
import apiClient from "../http/apiClient";
import { Context } from "../main";
import { deleteFromBasketData } from "../http/services/productService";

interface IBasketProductProps {
    basketItem: IProduct
    quantity: number
}

const BasketItem = (item: IBasketProductProps) => {
    const { user, product } = useContext(Context)!

    const handleAddQuantity = async () => {
        const existingProduct = item
        await apiClient.put(`api/basket/user/${user.user.id}/`, {
            product_id: existingProduct.basketItem.id,
            quantity: existingProduct.quantity + 1,
        })
        await product.fetchBasket(user.user.id);
    }

    const handleReduceQuantity = async () => {
        if (item.quantity === 1) {
            handleDeleteItem()
        } else {
            await apiClient.put(`api/basket/user/${user.user.id}/`, {
                product_id: item.basketItem.id,
                quantity: item.quantity - 1,
            })
            await product.fetchBasket(user.user.id);
        }
        
    }

    const handleDeleteItem = async () => {
        await deleteFromBasketData(user.user.id, item.basketItem.id)
        product.fetchBasket(user.user.id)
    }

    return (
        <li className="basket-item" key={item.basketItem.id}>
            <img className="basket-item__img" src={item.basketItem?.images[0]?.image} alt="" />
            <span className="basket-item__title">{item.basketItem.product_name}</span>
            <span className="basket-item__price">{item.basketItem.product_price} ₽</span>
            <button onClick={() => handleAddQuantity()} className="btn">+</button>
            <span>{item.quantity}</span>
            <button onClick={() => handleReduceQuantity()} className="btn">-</button>
            <button className="btn basket-item__delete-btn" onClick={() => handleDeleteItem()}>Удалить</button>
        </li>
    )
}

export default BasketItem