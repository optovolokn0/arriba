import React from "react";
import { useParams } from 'react-router-dom';
// import { ICategory, IProduct } from "../../models";

// import { products } from "../../data/productsData";
// import { categories } from "../../data/categoriesData";

import { ICategoryPageProps } from "../../models";

function CategoryPage({products, categories}: ICategoryPageProps){
    const { categorySlug } = useParams<{ categorySlug: string }>();

    // Находим категорию по slug
    const category = categories.find((cat) => cat.slug === categorySlug);
  
    if (!category) {
      return <div>Категория не найдена.</div>;
    }
  
    // Фильтруем товары по categoryId
    const filteredProducts = products.filter((product) => product.category_id === category.id);
  
    return (
      <div>
        <h2 className="products-list__title">{category.name}</h2>
        <div className="products-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product">
                <img src={product.photo} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Цена: {product.price} руб.</p>
              </div>
            ))
          ) : (
            <p>Товары не найдены в этой категории.</p>
          )}
        </div>
      </div>
    );
};
  
export default CategoryPage;