import React from "react";
import ProductsList from "../components/ProductsList";
// import { Spinner } from "react-bootstrap";
function Shop(){
    return (
        <div className="shop">
            {/* <Spinner animation="border"></Spinner> */}
            <ProductsList/>
        </div>
    )
}

export default Shop