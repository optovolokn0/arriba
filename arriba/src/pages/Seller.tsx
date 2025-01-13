import { useState } from "react";
import { observer } from "mobx-react-lite";
import SellerProducts from "../components/seller/SellerProducts";
import SellerStatistic from "../components/seller/SellerStatistic";

const Seller = observer(() => {
    const [activeComponent, setActiveComponent] = useState<string>('my-products')

    const renderComponent = () => {
        switch (activeComponent) {
            case 'statistic':
                return <SellerStatistic/>
            case 'my-products':
                return <SellerProducts/>
            default:
                return <div>Выберите страницу</div>
        }
    }
    return (
        <div className="seller">
            <div className="seller__nav-btns">
                <button onClick={()=>setActiveComponent('my-products')} className="btn seller__btn">Мои товары</button>
                <button onClick={()=>setActiveComponent('statistic')} className="btn seller__btn">Статистика</button>
            </div>
            {renderComponent()} 
        </div>
    )

})

export default Seller