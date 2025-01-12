import { observer } from "mobx-react-lite";
import React from "react";
import { REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import logo from '../../public/logoArriba.png'

const Footer = observer(() => {
    return (
        <footer className="footer">
            <a href={SHOP_ROUTE} className="logo footer__logo">
                <img src={logo} alt="Arriba" />
                <span>Arriba</span>
            </a>
            <div className="footer__nav-container">
                <div className="nav-container-sub">
                    Начать с Arriba
                    <a href={SHOP_ROUTE} className="footer__link">Главная</a>
                    <a href={REGISTRATION_ROUTE} className="footer__link">Регистрация / вход</a>
                    <a className="footer__link">Рекомендуемое</a>
                </div>
                <div className="nav-container-sub">
                    О нас
                    <a className="footer__link">О компании</a>
                    <a className="footer__link">Свяжитесь с нами</a>
                    <a className="footer__link">Отзывы</a>
                </div>
                <div className="nav-container-sub">
                    Поддержка
                    <a className="footer__link">FAQ</a>
                    <a className="footer__link">Чат поддержки</a>
                </div>
            </div>
            <span className="footer__name">Команда Scoofy Do</span>
        </footer>)
})

export default Footer