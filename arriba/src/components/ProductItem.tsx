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

const ProductItem = observer((item: ProductProps) => {
    const history = useNavigate()
    const { product } = useContext(Context)!

    return (
        <div className="product">
            <svg onClick={() => product.addToFavorites(item.productItem)} className="like-svg product__like-svg" width="20" height="20" viewBox="0 0 16 16" fill="transparent" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8933 3.07333C13.5528 2.73267 13.1485 2.46243 12.7036 2.27805C12.2586 2.09368 11.7817 1.99878 11.3 1.99878C10.8183 1.99878 10.3414 2.09368 9.89643 2.27805C9.45146 2.46243 9.04717 2.73267 8.70667 3.07333L8 3.78L7.29333 3.07333C6.60554 2.38554 5.67269 1.99914 4.7 1.99914C3.72731 1.99914 2.79446 2.38554 2.10666 3.07333C1.41887 3.76112 1.03247 4.69397 1.03247 5.66666C1.03247 6.63935 1.41887 7.5722 2.10666 8.26L8 14.1533L13.8933 8.26C14.234 7.91949 14.5042 7.51521 14.6886 7.07023C14.873 6.62526 14.9679 6.14832 14.9679 5.66666C14.9679 5.185 14.873 4.70807 14.6886 4.26309C14.5042 3.81812 14.234 3.41383 13.8933 3.07333Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            
            <div className="product__container" onClick={() => {
                product.setSelectedProduct(item.productItem.id)
                history(PRODUCT_ROUTE + '/' + item.productItem.id)
            }}>

                <img className="product__img" src={item.productItem.photo} alt={item.productItem.name} />
                <div className="product__textbox">
                    <span>{item.productItem.price} ₽</span>
                    <span>{item.productItem.name}</span>
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

export default ProductItem