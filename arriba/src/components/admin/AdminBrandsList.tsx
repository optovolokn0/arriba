import { useContext, useState } from "react";
import { Context } from "../../main";
import CreateBrand from "../modals/CreateBrand";
import { observer } from "mobx-react-lite";

const AdminBrandsList = observer(() => {
    const { product } = useContext(Context)!
    const [brandVisible, setBrandVisible] = useState(false)

    return (
        <>
            <ul className="admin__list admin__list_brands">
                Бренды
                {product.brands.map(item =>
                    <li key={item.brand_id} className="admin__item">{item.brand_name}
                        <div className="btn-container">
                            <button className="btn admin__btn-change">Изменить</button>
                            <button onClick={() => product.deleteBrand(item.brand_id)} className="btn admin__btn-delete">Удалить</button>
                        </div>
                    </li>
                )}
            </ul>
            <button className="btn admin__btn" onClick={() => setBrandVisible(true)}>Добавить бренд</button>
            <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
        </>

    )
})

export default AdminBrandsList