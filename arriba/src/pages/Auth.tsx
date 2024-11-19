import React from "react";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "../utils/consts";
import { useLocation } from "react-router-dom";
import bg from '../../public/bg-auth.png'

function Auth() {
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE

    return (
        <div className="auth">
            <div className="auth__box-bg">
                <img className="auth__bg" src={bg} alt="" />
                <img className="auth__bg" src={bg} alt="" />
            </div>

            <div className="auth__container">
                <form action="POST" className="auth__form">
                    <h2 className="auth__title">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                    <input className="auth__input" type="text" name="" id="" placeholder="Введите ваш email" />
                    <input className="auth__input" type="text" name="" id="" placeholder="Введите ваш пароль" />
                    <div className="auth__btns-container">
                        {isLogin ?
                            <div>Нет аккаунта?
                                <a className="auth__btn_registration" href={REGISTRATION_ROUTE}> Зарегистрируйся!</a>
                            </div>
                            :
                            <div>Есть аккаунт?
                                <a className="auth__btn_registration" href={LOGIN_ROUTE}> Войдите!</a>
                            </div>
                        }
                        <button className="btn auth__btn">{isLogin ? 'Войти' : 'Регистрация'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Auth