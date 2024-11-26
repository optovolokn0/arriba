import React, { useState } from "react";
import CreateCategory from "../components/modals/CreateCategory";
import CreateBrand from "../components/modals/CreateBrand";
import CreateProduct from "../components/modals/CreateProduct";

function Admin(){
    const [categoryVisible, setCategoryVisible] = useState(false)
    const [brandVisible, setBrandVisible] = useState(false)
    const [productVisible, setProductVisible] = useState(false)
    return (
        <div className="admin__container">
            <button className="btn admin__btn" onClick={() => setCategoryVisible(true)}>Добавить категорию</button>
            <button className="btn admin__btn" onClick={() => setBrandVisible(true)}>Добавить бренд</button>
            <button className="btn admin__btn" onClick={() => setProductVisible(true)}>Добавить товар</button>
            <CreateCategory show={categoryVisible} onHide={() => setCategoryVisible(false)}/>
            <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>
        </div>
    )
}

export default Admin