import React, { useContext, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import Header from './components/Header';
import { Context } from './main';

function App() {
	const { user, product } = useContext(Context)!

	useEffect(() => {
		if (localStorage.getItem('refresh_token')) {
			user.checkAuth()
		}
		product.fetchBrands()
		product.fetchCategories()
	}, [])

	return (
		<BrowserRouter>
			<Header />
			<AppRouter />
		</BrowserRouter>
	)
}

export default App;
