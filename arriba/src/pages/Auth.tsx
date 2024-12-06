import React, { useContext, useState } from "react";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "../utils/consts";
import { useLocation } from "react-router-dom";
import bg from '../../public/bg-auth.png'
import { Context } from "../main";
import { observer } from "mobx-react-lite";

const Auth = observer(() => {
    const location = useLocation()
    const { user } = useContext(Context)!
    const isLogin = location.pathname === LOGIN_ROUTE

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [password_confirm, setPasswordConfirm] = useState<string>('')
    const [isSeller, setIsSeller] = useState<boolean>(false)

    const handleRegister = async () => {
        try {
            const role = isSeller ? "12" : "11"
            await user.registration(name, email, password, password_confirm, role)
            alert("Регистрация успешна!")
        } catch (e) {
            console.error("Ошибка при регистрации:", e)
        }
    }

    const handleLogin = async () => {
        try {
            await user.login(email, password)
            alert("Авторизация успешна!")
        } catch (e) {
            console.error("Ошибка при авторизации:", e)
        }
    }

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
                        <input onChange={e => setEmail(e.target.value)} value={email} className="auth__input" type="text" placeholder="Введите email" />
                        <input onChange={e => setPassword(e.target.value)} value={password} className="auth__input" type="password" placeholder="Введите пароль" />
                        <div className="auth__btns-container">
                            <div>Нет аккаунта?
                                <a className="auth__btn_registration" href={REGISTRATION_ROUTE}> Зарегистрируйся!</a>
                            </div>
                            <button onClick={(e) => {
                                e.preventDefault()
                                handleLogin()
                            }} className="btn auth__btn">Войти</button>
                        </div>
                    </form>
                    :
                    <form action="POST" className="auth__form">
                        <h2 className="auth__title">Регистрация</h2>
                        <input onChange={e => setName(e.target.value)} value={name} className="auth__input" type="text" placeholder="Введите ваше имя" />
                        <input onChange={e => setEmail(e.target.value)} value={email} className="auth__input" type="text" placeholder="Введите email" />
                        <input onChange={e => setPassword(e.target.value)} value={password} className="auth__input" type="password" placeholder="Введите пароль" />
                        <input onChange={e => setPasswordConfirm(e.target.value)} value={password_confirm} className="auth__input" type="password" placeholder="Повторите пароль" />
                        <label>
                            <input type="checkbox" checked={isSeller} onChange={(e) => setIsSeller(e.target.checked)} />
                            Зарегистрироваться как продавец
                        </label>
                        <div className="auth__btns-container">
                            <div>Есть аккаунт?
                                <a className="auth__btn_registration" href={LOGIN_ROUTE}> Войдите!</a>
                            </div>
                            <button className="btn auth__btn" onClick={(e) => {
                                e.preventDefault()
                                handleRegister()
                            }
                            }>
                                Регистрация</button>
                        </div>
                    </form>

                }

            </div>
        </div>

    )
})

export default Auth