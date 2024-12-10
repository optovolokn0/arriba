import React, { useContext, useState } from "react";
import CreateCategory from "../components/modals/CreateCategory";
import CreateBrand from "../components/modals/CreateBrand";
import { Context } from "../main";
import { observer } from "mobx-react-lite";


const Admin = observer(() => {
    const [categoryVisible, setCategoryVisible] = useState(false)
    const [brandVisible, setBrandVisible] = useState(false)
    

    const { product } = useContext(Context)!


    return (
        <div className="admin__container">
            <div className="admin__lists">
                <ul className="admin__list admin__list_categories">
                    Категории
                    {product.categories.map(item =>
                        <li key={item.category_id} className="admin__item">{item.category_name}
                            <div className="btn-container">
                                <button className="btn change-btn">Изменить</button>
                                <button onClick={() => product.deleteCategory(item.category_id)} className="btn delete-btn">Удалить</button>
                            </div>
                        </li>
                    )}
                </ul>
                <ul className="admin__list admin__list_brands">
                    Бренды
                    {product.brands.map(item =>
                        <li key={item.brand_id} className="admin__item">{item.brand_name}
                            <div className="btn-container">
                                <button className="btn change-btn">Изменить</button>
                                <button onClick={()=> product.deleteBrand(item.brand_id)} className="btn delete-btn">Удалить</button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
            <div className="admin__btns-container">
                <button className="btn admin__btn" onClick={() => setCategoryVisible(true)}>Добавить категорию</button>
                <button className="btn admin__btn" onClick={() => setBrandVisible(true)}>Добавить бренд</button>
                <CreateCategory show={categoryVisible} onHide={() => setCategoryVisible(false)} />
                <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
                
            </div>
        </div>
    )
})

export default Admin