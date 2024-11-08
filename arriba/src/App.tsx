import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import Header from './components/header/Header';
import './styles/css/App.css';
import CategoryPage from './components/shared/CategoryPage';

import { categories } from './data/categoriesData';
import { products } from './data/productsData';

function App() {
  // Состояние для хранения текущей выбранной категории
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Функция для получения товаров по категории
  const getProductsByCategory = (categorySlug: string) => {
    return products.filter(product => {
      const category = categories.find(cat => cat.slug === categorySlug);
      return category && product.category_id === category.id;
    });
  };

  // Обработка параметра categorySlug из URL
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // Ставим выбранную категорию в состояние при обновлении URL
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory(null); // Если нет выбранной категории, сбрасываем состояние
    }
  }, [categorySlug]);

  return (
    <Router>
      <Header />
      <div className='main'>
        {/* Список категорий */}
		<h2 className='categories__title'>Категории</h2>
        <nav>
          <ul className='categories'>
            {categories.map((category) => (
              <li className='categories__item' key={category.id}>
                <Link to={`/${category.slug}`} onClick={() => setSelectedCategory(category.slug)}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          {/* Страница с товарами выбранной категории */}
          <Route
            path="/:categorySlug"
            element={
              selectedCategory ? (
                <CategoryPage
                  categories={categories}
                  products={getProductsByCategory(selectedCategory)}
                />
              ) : (
                <div>
                </div>
              )
            }
          />
          {/* Главная страница (отображается при переходе на '/') */}
          <Route
            path="/"
            element={
              <div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
