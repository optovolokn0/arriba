import React from "react";

function ProductPage(){
    const product = { id: 1, name: 'iphone', photo: '/cardPhoto.png', price: 1200, category_id: 1 }
    const description = [
        {id: 1, title: 'Оперативная память', descr: '8 гб'}, 
        {id: 2, title: 'Камера', descr: '50 мп'}, 
        {id: 3, title: 'Процессор', descr: 'test'}, 
        {id: 4, title: 'Количество ядер', descr: '8'}, 
        {id: 5, title: 'Аккумулятор', descr: '5000'}, 
    ]
    return (
        <div className="product-page">
            <img className="product-page__img" src={product.photo} alt="" />
            <div className="product-page__text-container">
                <h2 className="product-page__title">{product.name}</h2>
                {description.map(info => 
                    <span key={info.id} className="product-page__descr">
                        {info.title}: {info.descr}
                    </span>
                )}
            </div>
            <div className="product-page__bts-container">
                <span className="product-page__price">{product.price} P.</span>
                <button className="btn add-to-basket-btn">Добавить в корзину</button>
            </div>
        </div>
    )
}

export default ProductPage