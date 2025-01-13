import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../main";
import ProductItem from "./ProductItem";

const ProductsList = observer(() => {
    const { product } = useContext(Context)!

    const filteredProducts = product.products.filter((prod) => prod.category === product.selectedCategory && prod.product_name.toLowerCase().includes(product.searchedText.toLowerCase()))
    return (
        <ul className="products-list">
            {filteredProducts.length > 0 ?
                (filteredProducts.map(item => (
                    <ProductItem key={item.id} productItem={item} />
                )))
                :
                (
                    product.products.map(item => (
                        <ProductItem key={item.id} productItem={item} />
                    ))
                )

            }

        </ul>
    )
})

export default ProductsList