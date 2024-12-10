import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/css/normalize.css'
import './styles/css/fonts.css'
import { createContext } from 'react'
import UserStore from './store/UserStore.ts'
import ProductStore from './store/ProductStore.ts'
import { BrowserRouter } from 'react-router-dom'

interface ContextType {
    user: UserStore;
    product: ProductStore;
}

export const Context = createContext<ContextType | null>(null)
createRoot(document.getElementById('root')!).render(
    <Context.Provider value={{
        user: new UserStore(),
        product: new ProductStore()
    }}>
        <BrowserRouter>
            <App />
        </BrowserRouter>

    </Context.Provider>
)
