import React from "react";

import { IProduct } from "../../models";

interface ProductProps{
    product: IProduct
}

function CardItem(props: ProductProps){
    return (
    <>
        <div className="card__container">
            {/* href - ссылка на страницу товара */}
            <a href="#">
                <img src={props.product.photo} alt="asd" />
            </a>
            <div className="card__price">
                <span className="price">{props.product.price}</span>
            </div>
            <div className="card__textbox">
                <span className="card__title">{props.product.name}</span>
            </div>
            <div className="card__special-info">
                <div className="rating">4.9</div>
            </div>
        </div>
    </>
);
}

export default CardItem