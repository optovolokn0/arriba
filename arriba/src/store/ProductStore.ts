import { makeAutoObservable } from "mobx"
import { IBasket, IBrand, ICategory, IProduct } from "../models"
import { createBasketData, createBrandData, createCategoryData, createProductData, deleteBrandsData, deleteCategoriesData, deleteProductData, fetchBrandsData, fetchCategoriesData, fetchProduct, fetchProductsData, fetchUserBasketData} from "../http/services/productService"

export default class ProductStore {
    _categories: ICategory[]
    _brands: IBrand[]
    _products: IProduct[]
    _selectedCategory: number
    _selectedProduct: number
    _basket: IBasket

    constructor() {
        this._categories = []
        this._brands = []
        this._products = []
        this._basket = {id: NaN, user: NaN, products: []}
        this._selectedCategory = NaN
        this._selectedProduct = NaN

        makeAutoObservable(this)
    }

    setCategories(categories: ICategory[]) {
        this._categories = categories
    }

    setBrands(brands: IBrand[]){
        this._brands = brands
    }

    setProducts(products: IProduct[]) {
        this._products = products
    }

    setSelectedCategory(category: number) {
        this._selectedCategory = category
    }
    
    setSelectedProduct(productId: number) {
        this._selectedProduct = productId
    }

    setBasket(basket: IBasket) {
        this._basket = basket
    }

    get categories() {
        return this._categories
    }

    get brands() {
        return this._brands
    }

    get products() {
        return this._products
    }

    get selectedCategory() {
        return this._selectedCategory
    }

    get selectedProduct() {
        return this._selectedProduct
    }

    get basket() {
        return this._basket;
    }

    async fetchCategories(){
        try {
            const response = await fetchCategoriesData();
            this.setCategories(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    async createCategory(name: string){
        try {
            await createCategoryData(name);
        } catch (e) {
            console.error(e);
        }
    }

    async deleteCategory(id: number){
        try {
            await deleteCategoriesData(id)
            this.fetchCategories()
        } catch (e) {
            console.log(e)
        }
    }

    async fetchBrands(){
        try {
            const response = await fetchBrandsData();
            this.setBrands(response.data);
        } catch (e) {
            console.error(e);
        }
    }


    async createBrand(name: string){
        try {
            await createBrandData(name);
        } catch (e) {
            console.error(e);
        }
    }

    async deleteBrand(id: number){
        try {
            await deleteBrandsData(id)
            this.fetchBrands()
        } catch (e) {
            console.log(e)
        }
    }

    async fetchProducts(){
        try {
            const response = await fetchProductsData();
            this.setProducts(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    async fetchOneProduct(id: number){
        try {
            return await fetchProduct(id);
        } catch (e) {
            console.error(e);
        }
    }

    async createProduct(name: string, price: string, descr: string, characteristics: [], seller_id: number, brand_id: number, category_id: number){
        try {
            const data = await createProductData(name, price, descr, characteristics, seller_id, brand_id, category_id);
            return data
        } catch (e) {
            console.error(e);
        }
    }

    async deleteProduct(id: number){
        try {
            await deleteProductData(id)
            this.fetchProducts()
        } catch (e) {
            console.log(e)
        }
    }

    async createBasket(userId: number){
        try {
            const response = await createBasketData(userId);
            this.setBasket(response.data);
        } catch (e) {
            console.error(e);
        }
    } 

    async fetchBasket(userId: number){
        try {
            const response = await fetchUserBasketData(userId);
            this.setBasket(response.data);
        } catch (e) {
            console.error(e);
        }
    } 
}