import React, { useContext, useState } from "react";
import CreateCategory from "../components/modals/CreateCategory";
import CreateBrand from "../components/modals/CreateBrand";
import CreateProduct from "../components/modals/CreateProduct";
import { Context } from "../main";

function Admin() {
    const [categoryVisible, setCategoryVisible] = useState(false)
    const [brandVisible, setBrandVisible] = useState(false)
    const [productVisible, setProductVisible] = useState(false)

    const { product } = useContext(Context)!

    return (
        <div className="admin__container">
            <div className="admin__lists">
                <ul className="admin__list admin__list_categories">
                    Категории
                    {product.categories.map(item =>
                        <li key={item.id} className="admin__item">{item.name}</li>
                    )}
                </ul>
                <ul className="admin__list admin__list_brands">
                    Бренды
                    {product.brands.map(item =>
                        <li key={item.id} className="admin__item">{item.name}</li>
                    )}
                </ul>
            </div>
            <div className="admin__btns-container">
                <button className="btn admin__btn" onClick={() => setCategoryVisible(true)}>Добавить категорию</button>
                <button className="btn admin__btn" onClick={() => setBrandVisible(true)}>Добавить бренд</button>
                <button className="btn admin__btn" onClick={() => setProductVisible(true)}>Добавить товар</button>
                <CreateCategory show={categoryVisible} onHide={() => setCategoryVisible(false)} />
                <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
                <CreateProduct show={productVisible} onHide={() => setProductVisible(false)} />
            </div>

        </div>
    )
}

export default Admin