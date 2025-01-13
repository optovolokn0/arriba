import React, { useContext, useEffect, useState } from "react"

import { observer } from "mobx-react-lite"
import { Context } from "../main"
import { fetchProduct } from "../http/services/productService"
import { IProduct } from "../models"



const Orders = observer(() => {
    const { product } = useContext(Context)!

    const [productsData, setProductsData] = useState<Record<number, IProduct>>({}); // Состояние для данных продуктов

    useEffect(() => {
        const loadOrdersWithProducts = async () => {
            await product.fetchOrders(); // Загружаем заказы из API

            // Загружаем данные о продуктах для всех заказов
            const allProducts: Record<number, IProduct> = {};
            for (const order of product.orders) {
                for (const item of order.items) {
                    if (!allProducts[item.product]) {
                        const productData = await fetchProduct(item.product);
                        allProducts[item.product] = productData;
                    }
                }
            }
            setProductsData(allProducts); // Сохраняем данные продуктов
        };

        loadOrdersWithProducts();
    }, []);
    return (
        <div className="orders">
            <h2 className="orders__title">Ваши заказы</h2>
            <div className="orders_container">
                {product.orders.length > 0 ? (
                    product.orders.map(order => (
                        <div key={order.id} className="orders__item">
                            <div className="orders__item-descr">
                                <h3>Заказ №{order.id}</h3>
                                <span>Дата создания: {new Date(order.created_at).toLocaleDateString()}</span>
                                <span>Общая стоимость: {order.total_price} ₽</span>
                            </div>

                            <div className="orders__products-container">
                                {order.items.map(item => {
                                    const itemData = productsData[item.product]
                                    return (
                                        <div key={item.product} className="orders__product">
                                            <span>Товар: {itemData ? itemData.product_name : 'Загрузка'}</span>
                                            <span>Количество: {item.quantity}</span>
                                            <span>Цена: {item.price} ₽</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    ))
                ) : (
                    <p>Заказы отсутствуют.</p>
                )}
            </div>
        </div>
    )
})

export default Orders