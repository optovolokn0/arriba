import { useContext, useState } from "react"
import { Context } from "../main"
import { observer } from "mobx-react-lite"
import { useNavigate } from "react-router-dom"
import { ACCOUNT_ROUTE, ADMIN_ROUTE, BASKET_ROUTE, FAVORITES_ROUTE, LOGIN_ROUTE, ORDERS_ROUTE, SELLER_ROUTE, SHOP_ROUTE } from "../utils/consts"
import logo from '../../public/logoArriba.png'
import ReactDOM from "react-dom"
import CategoriesBar from "./CategoriesBar"

const Header = observer(() => {
    const { user, product } = useContext(Context)!
    const history = useNavigate()
    const [searchedText, setSearchedText] = useState('')
    const [isCategoriesBarVisible, setIsCategoriesBarVisible] = useState(false)

    const toggleCategoriesBar = () => {
        history(SHOP_ROUTE)
        setIsCategoriesBarVisible((prev) => !prev)
    };

    const closeCategoriesBar = () => {
        setIsCategoriesBarVisible(false)
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedText(event.target.value);
    }

    const handleSearch = () => {
        product.setSearchedText(searchedText)
    }

    return (
        <header className="header">
            <div className="header__container">
                <a href={SHOP_ROUTE} className="logo header__logo">
                    <img src={logo} alt="Arriba" />
                    <span>Arriba</span>
                </a>
                {(user.isAuth === false || user.user.role === 'client') ?
                    <div className="center-container">
                        <button className="btn btn_catalog burger-container" onClick={toggleCategoriesBar}>
                            <span className="burger-line"></span>
                        </button>

                        {ReactDOM.createPortal(
                            <>
                                <div className={`categories__bar ${isCategoriesBarVisible ? "visible" : ""}`}>
                                    <CategoriesBar onClose={closeCategoriesBar} />
                                </div>
                                {isCategoriesBarVisible && (
                                    <div className="overlay" onClick={closeCategoriesBar}></div>
                                )}
                            </>,
                            document.body
                        )}
                        <input className="header__input" type="text" value={searchedText} onChange={handleInputChange} placeholder="Найти на Arriba" />
                        <button onClick={handleSearch}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.9268 17.04L20.4 20.4M11.4 7.20001C13.3882 7.20001 15 8.81178 15 10.8M19.28 11.44C19.28 15.7699 15.7699 19.28 11.44 19.28C7.11006 19.28 3.59998 15.7699 3.59998 11.44C3.59998 7.11009 7.11006 3.60001 11.44 3.60001C15.7699 3.60001 19.28 7.11009 19.28 11.44Z" stroke="black" stroke-width="2" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                    :
                    null
                }

                <div className="right-container">
                    {(user.isAuth === false || user.user.role === 'client') ?
                        <div className="right-container__client">
                            <a onClick={() => history(FAVORITES_ROUTE)} className="right-container__item">
                                <svg className="like-svg" width="20" height="20" viewBox="0 0 16 16" fill="transparent" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8933 3.07333C13.5528 2.73267 13.1485 2.46243 12.7036 2.27805C12.2586 2.09368 11.7817 1.99878 11.3 1.99878C10.8183 1.99878 10.3414 2.09368 9.89643 2.27805C9.45146 2.46243 9.04717 2.73267 8.70667 3.07333L8 3.78L7.29333 3.07333C6.60554 2.38554 5.67269 1.99914 4.7 1.99914C3.72731 1.99914 2.79446 2.38554 2.10666 3.07333C1.41887 3.76112 1.03247 4.69397 1.03247 5.66666C1.03247 6.63935 1.41887 7.5722 2.10666 8.26L8 14.1533L13.8933 8.26C14.234 7.91949 14.5042 7.51521 14.6886 7.07023C14.873 6.62526 14.9679 6.14832 14.9679 5.66666C14.9679 5.185 14.873 4.70807 14.6886 4.26309C14.5042 3.81812 14.234 3.41383 13.8933 3.07333Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="right-container__text">Избранное</span>
                            </a>
                            <a onClick={() => user.isAuth ? history(ORDERS_ROUTE) : history(LOGIN_ROUTE)} className="right-container__item my-order">
                                <svg className="order-package-svg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.75 7.83333L6.25 3.50833M2.725 5.8L10 10.0083L17.275 5.8M10 18.4V10M17.5 13.3333V6.66666C17.4997 6.37439 17.4225 6.08734 17.2763 5.8343C17.13 5.58126 16.9198 5.37113 16.6667 5.225L10.8333 1.89166C10.58 1.74538 10.2926 1.66837 10 1.66837C9.70744 1.66837 9.42003 1.74538 9.16667 1.89166L3.33333 5.225C3.08022 5.37113 2.86998 5.58126 2.72372 5.8343C2.57745 6.08734 2.5003 6.37439 2.5 6.66666V13.3333C2.5003 13.6256 2.57745 13.9127 2.72372 14.1657C2.86998 14.4187 3.08022 14.6289 3.33333 14.775L9.16667 18.1083C9.42003 18.2546 9.70744 18.3316 10 18.3316C10.2926 18.3316 10.58 18.2546 10.8333 18.1083L16.6667 14.775C16.9198 14.6289 17.13 14.4187 17.2763 14.1657C17.4225 13.9127 17.4997 13.6256 17.5 13.3333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="right-container__text">Заказы</span>
                            </a>
                            <a className="right-container__item shopping-cart" onClick={() => user.isAuth ? history(BASKET_ROUTE) : history(LOGIN_ROUTE)}>
                                <svg className="shopping-cart-svg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_2312_48)">
                                        <path d="M0.833313 0.833344H4.16665L6.39998 11.9917C6.47618 12.3753 6.6849 12.72 6.9896 12.9653C7.2943 13.2105 7.67556 13.3408 8.06665 13.3333H16.1666C16.5577 13.3408 16.939 13.2105 17.2437 12.9653C17.5484 12.72 17.7571 12.3753 17.8333 11.9917L19.1666 5.00001H4.99998M8.33331 17.5C8.33331 17.9602 7.96022 18.3333 7.49998 18.3333C7.03974 18.3333 6.66665 17.9602 6.66665 17.5C6.66665 17.0398 7.03974 16.6667 7.49998 16.6667C7.96022 16.6667 8.33331 17.0398 8.33331 17.5ZM17.5 17.5C17.5 17.9602 17.1269 18.3333 16.6666 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5C15.8333 17.0398 16.2064 16.6667 16.6666 16.6667C17.1269 16.6667 17.5 17.0398 17.5 17.5Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2312_48">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span className="right-container__text">Корзина</span>
                            </a>
                        </div>
                        :
                        null
                    }


                    {user.user.role === 'admin' ?
                        <a className="right-container__item admin" onClick={() => history(ADMIN_ROUTE)}>
                            <span className="right-container__text">Админ панель</span>
                        </a>
                        :
                        null
                    }

                    {user.user.role === 'seller' ?
                        <a className="right-container__item seller" onClick={() => history(SELLER_ROUTE)}>
                            <span className="right-container__text">Панель продавца</span>
                        </a>
                        :
                        null
                    }

                    {user.isAuth ?
                        <a className="right-container__item user" onClick={() => {
                            history(ACCOUNT_ROUTE)
                        }}>
                            <svg className="user-svg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.6666 17.5V15.8333C16.6666 14.9493 16.3155 14.1014 15.6903 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66665C5.78259 12.5 4.93474 12.8512 4.30962 13.4763C3.6845 14.1014 3.33331 14.9493 3.33331 15.8333V17.5M13.3333 5.83333C13.3333 7.67428 11.8409 9.16667 9.99998 9.16667C8.15903 9.16667 6.66665 7.67428 6.66665 5.83333C6.66665 3.99238 8.15903 2.5 9.99998 2.5C11.8409 2.5 13.3333 3.99238 13.3333 5.83333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="right-container__text">Личный кабинет</span>
                        </a>
                        :
                        <a className="right-container__item user" onClick={() => history(LOGIN_ROUTE)}>
                            <svg className="user-svg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.6666 17.5V15.8333C16.6666 14.9493 16.3155 14.1014 15.6903 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66665C5.78259 12.5 4.93474 12.8512 4.30962 13.4763C3.6845 14.1014 3.33331 14.9493 3.33331 15.8333V17.5M13.3333 5.83333C13.3333 7.67428 11.8409 9.16667 9.99998 9.16667C8.15903 9.16667 6.66665 7.67428 6.66665 5.83333C6.66665 3.99238 8.15903 2.5 9.99998 2.5C11.8409 2.5 13.3333 3.99238 13.3333 5.83333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="right-container__text">Войти</span>
                        </a>
                    }
                </div>
            </div>
        </header>
    )
})

export default Header