import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { IProduct } from "../models";
import { useNavigate } from "react-router-dom";
import { PRODUCT_ROUTE } from "../utils/consts";
import { Context } from "../main";
import star from '../../public/Star.png'
import msg from '../../public/msg.png'

interface ProductProps {
    productItem: IProduct
}

const FavoritesItem = observer((item: ProductProps) => {
    const history = useNavigate()
    const { product } = useContext(Context)!

    return (
        <div className="product">
            <svg onClick={() => product.removeFromFavorites(item.productItem.id)} className="product__delete-btn" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#1D1B20" />
            </svg>

            <div className="product__container" onClick={() => {
                product.setSelectedProduct(item.productItem.id)
                history(PRODUCT_ROUTE + '/' + item.productItem.id)
            }}>

                {/* <img className="product__img" src={item.productItem.photo} alt={item.productItem.name} /> */}
                <div className="product__textbox">
                    <span>{item.productItem.product_price} ₽</span>
                    <span>{item.productItem.product_name}</span>
                </div>
                <div className="product__descr-box">
                    <div className="product__rat-box">
                        <img src={star} className="product__rat-img" alt="stars" />
                        <span className="product__rating">4.7</span>
                    </div>
                    <div className="product__review-box">
                        <img src={msg} alt="msgs" className="product__review-img" />
                        <span className="product__reviews-count">12 отзывов</span>
                    </div>
                </div>
            </div>
            <button onClick={() => product.addToBasket(item.productItem)} className="btn product__buy-btn">Купить</button>
        </div>

    )
})

export default FavoritesItem