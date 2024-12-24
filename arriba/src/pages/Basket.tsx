import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import BasketItem from "../components/BasketItem";
import { fetchProduct } from "../http/services/productService";
import { IProduct } from "../models";



const Basket = observer(() => {
    const { product, user } = useContext(Context)!

    const [basketProducts, setBasketProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Загрузка данных корзины при авторизации
    useEffect(() => {
        if (product.basket.products.length === 0) {
            product.fetchBasket(user.user.id);
        }
    }, [product.basket.products, product, user.user.id]);

    // Загрузка данных продуктов
    useEffect(() => {
        const fetchProducts = async () => {
            if (product.basket.products.length > 0) {
                const loadedProducts = await Promise.all(
                    product.basket.products.map((item) => fetchProduct(item.product))
                );
                setBasketProducts(loadedProducts);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [product.basket.products]);

    if (loading) {
        return <div>Загрузка корзины...</div>;
    }



    return (
        <div className="basket">
            <div className="basket__title">Корзина</div>
            <div className="basket__container">
                {product.basket.products.length === 0 ? (
                    <p>Корзина пуста</p>
                ) 
                : 
                (
                    <ul className="basket__list">
                        {basketProducts.map((item) => {
                            const basketItem = product.basket.products.find(
                                (bItem) => bItem.product === item.id)
                            return (
                                <BasketItem key={basketItem?.product} basketItem={item} quantity={basketItem?.quantity || 1 } />
                            )
                            }
                        )}
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

