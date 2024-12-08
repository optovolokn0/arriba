import React, { useContext, useState } from "react";
import AccountSettings from "../components/account/AccountSettings";
import { useNavigate } from "react-router-dom";
import { BASKET_ROUTE, ORDERS_ROUTE } from "../utils/consts";
import AccountSupport from "../components/account/AccountSupport";
import avatar from '../../public/avatar.png'
import { observer } from "mobx-react-lite";
import { Context } from "../main";


const Account = observer(() => {
    const {user} = useContext(Context)!
    const [activeComponent, setActiveComponent] = useState<string>('settings')
    const history = useNavigate()

    const renderComponent = () => {
        switch (activeComponent) {
            case 'settings':
                return <AccountSettings />
            case 'support':
                return <AccountSupport />
            default:
                return <div>Выберите страницу</div>
        }
    }

    const exitFromAccount = () => {
        localStorage.clear()
        location.reload()
    }

    return (
        <div className="account">
            <div className="account__info">
                <div className="account__personal-box">
                    <img src={avatar} alt="avatar" />
                    <div className="account__name">{user.user.role}</div>
                </div>

                <nav className="account__nav">
                    <button onClick={() => setActiveComponent('settings')} className="btn account__btn">Настройки аккаунта</button>
                    <button onClick={() => history(ORDERS_ROUTE)} className="btn account__btn">Мои заказы</button>
                    <button onClick={() => history(BASKET_ROUTE)} className="btn account__btn">Корзина</button>
                    <button onClick={() => setActiveComponent('support')} className="btn account__btn">Поддержка</button>
                    <button onClick={() => exitFromAccount()} className="btn account__btn account__btn_exit">Выйти</button>
                </nav>
            </div>
            {renderComponent()}
        </div>
    )
})

export default Account