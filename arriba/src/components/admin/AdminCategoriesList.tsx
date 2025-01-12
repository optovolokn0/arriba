import React, { useContext, useState } from "react";
import { Context } from "../../main";
import CreateCategory from "../modals/CreateCategory";
import { observer } from "mobx-react-lite";

const AdminCategoriesList = observer(() => {
    const { product } = useContext(Context)!
    const [categoryVisible, setCategoryVisible] = useState(false)

    return (
        <>
            <ul className="admin__list admin__list_categories">
                Категории
                {product.categories.map(item =>
                    <li key={item.category_id} className="admin__item">{item.category_name}
                        <div className="btn-container">
                            <button className="btn admin__btn-change">Изменить</button>
                            <button onClick={() => product.deleteCategory(item.category_id)} className="btn admin__btn-delete">Удалить</button>
                        </div>
                    </li>
                )}
            </ul>
            <button className="btn admin__btn" onClick={() => setCategoryVisible(true)}>Добавить категорию</button>
            <CreateCategory show={categoryVisible} onHide={() => setCategoryVisible(false)} />
        </>
    )
})

export default AdminCategoriesList