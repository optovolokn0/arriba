import React, { useContext } from "react"
import { Context } from "../main"
import { observer } from "mobx-react-lite"
import FavoritesItem from "../components/FavoritesItem"

const Favorites = observer(() => {
    const { product } = useContext(Context)!

    return (
        <div className="favorites">
            <h2 className="favorites__title">Избранное</h2>
            <div className="favorites__list">
                {product.favorites.map(item =>
                    <FavoritesItem key={item.id} productItem={item} />
                )}
            </div>
        </div>
    )
})

export default Favorites