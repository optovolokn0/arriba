import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import CreateProduct from "../modals/CreateProduct";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import { PRODUCT_ROUTE } from "../../utils/consts";
import star from '../../../public/Star.png'
import msg from '../../../public/msg.png'
import ConfirmDelete from "../modals/ConfirmDelete";


const SellerProducts = observer(()=>{
    const {product, user} = useContext(Context)!
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [productVisible, setProductVisible] = useState(false)
    const sellerProducts = product.products.filter((prod) => prod.seller === user.user.id)
    const history = useNavigate()

    return (
    <div className="seller__products">
        <ul className="products-list seller__list">
            {sellerProducts.map(item => (
                <div className="product" key={item.id}>
                <div className="product__container" onClick={() => {
                    product.setSelectedProduct(item.id)
                    history(PRODUCT_ROUTE + '/' + item.id)
                }}>

                    <img className="product__img" src={item?.images[0]?.image} alt={item.product_name} />
                    <div className="product__textbox">
                        <span>{item.product_price} ₽</span>
                        <span>{item.product_name}</span>
                    </div>
                    <div className="product__descr-box">
                        <div className="product__rat-box">
                            <img src={star} className="product__rat-img" alt="stars" />
                            <span className="product__rating">4.7</span>
                        </div>
                        <div className="product__review-box">
                            <img src={msg} alt="msgs" className="product__review-img" />
                            <span className="product__reviews-count">12 отзывов</span>
                        </div>
                    </div>
                </div>
                <button onClick={()=>setConfirmDelete(true)} className="btn admin__btn admin__btn-delete">Удалить</button>
                <ConfirmDelete show={confirmDelete} onHide={() => setConfirmDelete(false)} item={item}/>
            </div>
            ))}
        </ul>
        <button className="btn seller__btn" onClick={() => {setProductVisible(true)}}>Добавить товар</button>
        <CreateProduct show={productVisible} onHide={() => setProductVisible(false)} />
    </div>)
})

export default SellerProducts