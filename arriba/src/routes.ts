import Admin from "./pages/Admin"
import Auth from "./pages/Auth"
import Basket from "./pages/Basket"
import ProductPage from "./pages/ProductPage"
import Shop from "./pages/Shop"
import Favorites from "./pages/Favorites"
import Account from "./pages/Account"
import Orders from "./pages/Orders"
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, PRODUCT_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, FAVORITES_ROUTE, ACCOUNT_ROUTE, ORDERS_ROUTE, SELLER_ROUTE } from "./utils/consts"
import Seller from "./pages/Seller"


export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: ACCOUNT_ROUTE,
        Component: Account
    },
    {
        path: ORDERS_ROUTE,
        Component: Orders
    },
    {
        path: SELLER_ROUTE,
        Component: Seller
    }
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        Component: ProductPage
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: FAVORITES_ROUTE,
        Component: Favorites
    }
]