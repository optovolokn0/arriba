import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../main";
import ProductItem from "./ProductItem";

const ProductsList = observer(() => {
    const { product } = useContext(Context)!

    const filteredProducts = product.products.filter((prod) => prod.category_id === product.selectedCategory)
    return (
        <ul className="products-list">
            {filteredProducts.length > 0 ?
                (filteredProducts.map(item => (
                    <ProductItem key={item.id} productItem={item} />
                )))
                :
                (
                    // <span>Товары этой категории не найдены. Посмотрите другие товары</span>
                    product.products.map(item => (
                        <ProductItem key={item.id} productItem={item} />
                    ))
                )

            }

        </ul>
    )
})

export default ProductsList