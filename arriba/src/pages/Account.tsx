import React from "react";

function Account () {
    return (
        <div className="account">
            <div className="account__container">
                <div className="account__info">
                    <div className="account__name">Arribas</div>
                    <nav className="account__nav">
                        <button className="account__elem btn account__btn">Настройки аккаунта</button>
                        <button className="account__elem btn account__btn">Мои заказы</button>
                        <button className="account__elem btn account__btn">Корзина</button>
                        <button className="account__elem btn account__btn">Избранное</button>
                        <button className="account__elem btn account__btn">Поддержка</button>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Account