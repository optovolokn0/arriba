import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../main";
import BasketItem from "../components/BasketItem";

const Basket = observer(() => {
    const { product } = useContext(Context)!

    return (
        <div className="basket">
            <div className="basket__title">Корзина</div>
            <div className="basket__container">
                {product.basket.length === 0 ? (
                    <p>Корзина пуста</p>
                ) : (
                    <ul className="basket__list">
                        {product.basket.map((item) => (
                            <BasketItem basketItem={item}/>
                        ))}
                    </ul>
                )}
                <div className="payment">
                    <div className="payment__container">
                        <div className="payment__list"></div>
                    </div>
                    <button className="btn payment__btn">Перейти к оформлению заказа</button>
                </div>
            </div>
        </div>
    )
})

export default Basket

