import React from "react";
import CategoriesBar from "../components/CategoriesBar";
import ProductsList from "../components/ProductsList";
function Shop(){
    return (
        <div className="shop">
            <CategoriesBar/>
            <ProductsList/>
        </div>
    )
}

export default Shop