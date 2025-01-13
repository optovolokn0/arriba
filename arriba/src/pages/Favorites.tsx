import { useContext, useEffect, useState } from "react"
import { Context } from "../main"
import { observer } from "mobx-react-lite"
import ProductItem from "../components/ProductItem"
import { IProduct } from "../models"

const Favorites = observer(() => {
    const { product } = useContext(Context)!
    const [favoriteProducts, setFavoriteProducts] = useState<IProduct[]>([])

    const getFavorites = (): number[] => {
        const data = localStorage.getItem("favorites");
        return data ? JSON.parse(data) : [];
    };

    useEffect(() => {
        const favoriteIds = getFavorites()
        const filteredProducts = product.products.filter((item) => 
            favoriteIds.includes(item.id)
        )

        setFavoriteProducts(filteredProducts)
    }, [product.products])

    return (
        <div className="favorites">
            <h2 className="favorites__title">Избранное</h2>
            <div className="favorites__list">
                {favoriteProducts.map(item =>
                    <ProductItem key={item.id} productItem={item} />
                )}
            </div>
        </div>
    )
})

export default Favorites