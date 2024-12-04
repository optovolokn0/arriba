import React, { useContext } from "react";
import { Context } from "../main";
import { IProduct } from "../models";

interface BasketItemProps{
    basketItem: IProduct
}

const BasketItem = (item: BasketItemProps) => {
    const { product } = useContext(Context)!
    return (
        <li className="basket-item" key={item.basketItem.id}>
            <img className="basket-item__img" src={item.basketItem.photo} alt="" />
            <span className="basket-item__title">{item.basketItem.name}</span>
            <span className="basket-item__price">{item.basketItem.price} ₽</span>
            <button className="btn basket-item__delete-btn" onClick={() => product.removeFromBasket(item.basketItem.id)}>
                Удалить
            </button>
        </li>
    )
}

export default BasketItem