import React, { useState } from "react";
import { categories } from "../../data/categoriesData";

function CategoryList() {
    const [activeCategory, setActiveCategory] = useState<number | null>(null)

    // Функция для фильтрации вложенных категорий
    const getSubcategories = (parentId: number) => {
        return categories.filter(category => category.parentId === parentId)
    };

    // Основной список категорий (без вложенных)
    const mainCategories = categories.filter(category => !category.parentId)

    return (
        <div>
          <h2>Категории</h2>
          <ul>
            {mainCategories.map(category => (
              <li key={category.id}>
                <div>
                  <button onClick={() => setActiveCategory(category.id)}>
                    {category.name}
                  </button>
                </div>
                {activeCategory === category.id && (
                  <ul>
                    {getSubcategories(category.id).map(subcategory => (
                      <li key={subcategory.id}>
                        <a href={`/${subcategory.slug}`}>{subcategory.name}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
    )
}

export default CategoryList