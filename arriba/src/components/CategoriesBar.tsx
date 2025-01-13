import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../main";

interface CategoriesBarProps {
    onClose: () => void
  }

const CategoriesBar: React.FC<CategoriesBarProps> = observer(({ onClose }) => {
    const { product } = useContext(Context)!

    const handleCategoryClick = (categoryId: number) => {
        product.setSelectedCategory(categoryId)
        onClose()
      }

    return (
        <div className="categories">
            <ul className="categories__list">
                Категории
                {product.categories.map(category =>
                    <li className="categories__item"
                     key={category.category_id}
                     onClick={() => handleCategoryClick(category.category_id)}>
                        {category.category_name}
                    </li>
                )}
            </ul>
        </div>
    )
})

export default CategoriesBar