import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import Header from './components/Header';
import { Context } from './main';
import { ADMIN_ROUTE, SELLER_ROUTE, SHOP_ROUTE } from './utils/consts';

function App() {
	const { user, product } = useContext(Context)!
	const history = useNavigate()

	useEffect(() => {
		async function initialize(){
			if (localStorage.getItem('refresh_token')) {
				await user.checkAuth()
				switch (user.user.role){
					case 'admin':
						history(ADMIN_ROUTE);
						break;
					case 'seller':
						history(SELLER_ROUTE);
						break;
					default:
						history(SHOP_ROUTE);
						break;
				}
			}
			product.fetchBrands()
			product.fetchCategories()
			product.fetchProducts()
			try {
				product.fetchBasket(user.user.id)
			} catch {
				product.createBasket(user.user.id)
			}
		}
		initialize()
	}, [])

	
	return (
		<>
			<Header />
			<AppRouter />
		</>
	)
}

export default App;
