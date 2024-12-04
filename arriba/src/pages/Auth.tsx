import React, { useContext } from "react";
import { ACCOUNT_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import { useLocation, useNavigate } from "react-router-dom";
import bg from '../../public/bg-auth.png'
import { Context } from "../main";

function Auth() {
    const location = useLocation()
    const { user } = useContext(Context)!
    const history = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE

    return (
        <div className="auth">
            <div className="auth__box-bg">
                <img className="auth__bg" src={bg} alt="" />
                <img className="auth__bg" src={bg} alt="" />
            </div>

            <div className="auth__container">

                {isLogin ?
                    <form action="POST" className="auth__form">
                        <h2 className="auth__title">Авторизация</h2>
                        <input className="auth__input" type="text" name="" id="" placeholder="Введите email" />
                        <input className="auth__input" type="password" name="" id="" placeholder="Введите пароль" />
                        <div className="auth__btns-container">
                            <div>Нет аккаунта?
                                <a className="auth__btn_registration" href={REGISTRATION_ROUTE}> Зарегистрируйся!</a>
                            </div>
                            <button className="btn auth__btn">Войти</button>
                        </div>
                    </form>
                    :
                    <form action="POST" className="auth__form">
                        <h2 className="auth__title">Регистрация</h2>
                        <input className="auth__input" type="text" placeholder="Введите ваше имя" />
                        <input className="auth__input" type="text" name="" id="" placeholder="Введите email" />
                        <input className="auth__input" type="password" name="" id="" placeholder="Введите пароль" />
                        <input className="auth__input" type="password" name="" id="" placeholder="Повторите пароль" />
                        <div className="auth__btns-container">
                            <div>Есть аккаунт?
                                <a className="auth__btn_registration" href={LOGIN_ROUTE}> Войдите!</a>
                            </div>
                            <button className="btn auth__btn" onClick={(e) => {
                                e.preventDefault()
                                user.setIsAuth(true)
                                history(ACCOUNT_ROUTE)
                            }
                            }>
                                Регистрация</button>
                        </div>
                    </form>

                }

            </div>
        </div>

    )
}

export default Auth