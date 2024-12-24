import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import AdminCategoriesList from "../components/admin/AdminCategoriesList";
import AdminBrandsList from "../components/admin/AdminBrandsList";
import AdminProductsList from "../components/admin/AdminProductsList";
import AdminUsersList from "../components/admin/AdminUsersList";



const Admin = observer(() => {
    
    const [activeComponent, setActiveComponent] = useState<string>('products')

    const renderComponent = () => {
        switch (activeComponent) {
            case 'categories':
                return <AdminCategoriesList />
            case 'brands':
                return <AdminBrandsList />
            case 'products':
                return <AdminProductsList/>   
            case 'users':
                return <AdminUsersList/> 
            default:
                return <div>Выберите страницу</div>
        }
    }

    return (
        <div className="admin__container">
            <div className="admin__lists">
                {renderComponent()}
            </div>
            <div className="admin__btns-container">
                <button onClick={()=>setActiveComponent('categories')} className="btn admin__btn">Категории</button>
                <button onClick={()=>setActiveComponent('brands')} className="btn admin__btn">Бренды</button>
                <button onClick={()=>setActiveComponent('products')} className="btn admin__btn">Товары</button>
                {/* <button onClick={()=>setActiveComponent('users')} className="btn admin__btn">Пользователи</button> */}
            </div>
        </div>
    )
})

export default Admin