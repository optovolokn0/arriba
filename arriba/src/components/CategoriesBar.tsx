import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../main";

const CategoriesBar = observer(() => {
    const { product } = useContext(Context)!

    return (
        <div className="categories">
            <h3 className="categories__title">Категории</h3>
            <ul className="categories__list">
                {product.categories.map(category =>
                    <li className="categories__item"
                     key={category.id}
                     onClick={() => product.setSelectedCategory(category.id)}>
                        {category.name}
                    </li>
                )}
            </ul>
        </div>
    )
})

export default CategoriesBar