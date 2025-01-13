import { useContext } from "react";
import { Context } from "../main";
import star from '../../public/Star.png'
import msg from '../../public/msg.png'
import apiClient from "../http/apiClient";
import { addToUserBasketData } from "../http/services/productService";

function ProductPage() {
    const { user, product } = useContext(Context)!
    const selectedProd = product.products.find(prod => prod.id === product.selectedProduct)

    const handleAddToBasket = async () => {
        // Проверяем, есть ли товар в корзине
        const existingProduct = product.basket.products.find(
            (basketItem) => basketItem.product === selectedProd?.id
        );
    
        if (existingProduct) {
            // Если товар уже есть, увеличиваем количество
            await apiClient.put(`api/basket/user/${user.user.id}/`, {
                product_id: existingProduct.product,
                quantity: existingProduct.quantity + 1,
            });
        } else {
            // Если товара нет, добавляем его
            await addToUserBasketData(user.user.id, selectedProd?.id, 1);
        }
    
        // Обновляем корзину
        await product.fetchBasket(user.user.id);
    }

    return (
        <>
            {
                selectedProd ? (
                    <div className="product-page">
                        <div className="product-page__container">

                            <div className="product-page__container_left">
                                <img className="img" src={selectedProd?.images[0]?.image} alt={selectedProd.product_name} />
                            </div>

                            <div className="product-page__container_center">
                                <h2 className="title">{selectedProd.product_name}</h2>
                                <div className="info-box">
                                    <div className="rat-box">
                                        <img src={star} className="rat-img" alt="stars" />
                                        <span className="rating">4.7</span>
                                    </div>
                                    <div className="review-box">
                                        <img src={msg} alt="msgs" className="review-img" />
                                        <span className="reviews-count">12 отзывов</span>
                                    </div>
                                </div>
                                <ul className="about">О товаре
                                    {selectedProd.characteristics.map(info =>
                                        <li key={info.id} className="about-elem">
                                            <div className="name">{info.name}</div>
                                            <div className="value">{info.value}</div>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="product-page__container_right">
                                <div className="buy-container">
                                    <span className="price">Цена {selectedProd.product_price} P.</span>
                                    <button onClick={() => handleAddToBasket()} className="btn add-to-basket-btn">Добавить в корзину</button>
                                </div>
                                <div className="delivery">
                                    Информация о доставке
                                    <div className="delivery__container">
                                        <div className="delivery__address">Адрес: Россия, г.Екатеринбург, Мира 32</div>
                                        <div className="ways-to-get">Способы получения
                                            <button className="btn ways-to-get-btn">Курьером</button>
                                            <button className="btn ways-to-get-btn">Почтой</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="product-page__descr-container">
                            <h3 className="title">Описание</h3>
                            <p className="text">
                                {selectedProd.product_description}
                            </p>
                        </div>
                        <div className="reviews">
                            <ul className="reviews-list">
                                {}
                            </ul>
                        </div>
                    </div>
                )
                    :
                    (
                        <div className="product-page__container">
                            <span>Товар не найден</span>
                        </div>
                    )
            }

        </>

    )
}

export default ProductPage