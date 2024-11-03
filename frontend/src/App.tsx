import React from 'react';
import './styles/css/App.css'
import ProductList from './components/ProductList';
import { productList } from './data/productsListData';

function App() {
	return (
		<div className="App">
			{productList.map(elem => 
				<ProductList productList={elem} key={elem.id}/>
			)}
		</div>
	);
}

export default App;
