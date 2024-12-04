import React, { useContext } from "react";
import { Context } from "../main";

function ProductPage() {
    const { product } = useContext(Context)!
    const selectedProd = product.products.find(prod => prod.id === product.selectedProduct)

    return (
        <div className="product-page">
            {
                selectedProd ? (
                    <div className="product-page__container">
                        <img className="product-page__img" src={selectedProd.photo} alt="" />
                        <div className="product-page__text-container">
                            <h2 className="product-page__title">{selectedProd.name}</h2>
                            {selectedProd.description.map(info =>
                                <span key={info.id} className="product-page__descr">
                                    {info.title}: {info.descr}
                                </span>
                            )}
                        </div>
                        <div className="product-page__bts-container">
                            <span className="product-page__price">{selectedProd.price} P.</span>
                            <button onClick={() => product.addToBasket(selectedProd)} className="btn add-to-basket-btn">Добавить в корзину</button>
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

        </div>

    )
}

export default ProductPage