import React, { useState } from "react";
import CreateProduct from "../components/modals/CreateProduct";
import { observer } from "mobx-react-lite";

const Seller = observer(() => {
    const [productVisible, setProductVisible] = useState(false)
    return (
        <div>
            <button className="btn admin__btn" onClick={() => setProductVisible(true)}>Добавить товар</button>
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)} /> 
        </div>
    )

})

export default Seller