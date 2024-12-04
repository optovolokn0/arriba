import { makeAutoObservable } from "mobx"
import { IBrand, ICategory, IProduct } from "../models"

export default class ProductStore {
    _categories: ICategory[]
    _brands: IBrand[]
    _products: IProduct[]
    _selectedCategory: number
    _selectedProduct: number
    _basket: IProduct[]
    _favorites: IProduct[]

    constructor() {
        this._categories = [
            { id: 1, name: 'Телефоны' },
            { id: 2, name: 'Еда' },
            { id: 3, name: 'Спорт' },
            { id: 4, name: 'Одежда' }
        ]

        this._brands = [
            { id: 1, name: 'Samsung' },
            { id: 2, name: 'test' },
            { id: 3, name: 'test2' },
            { id: 4, name: 'test3' }
        ]

        this._products = [
            {
                id: 1, name: 'iphone', photo: '/cardPhoto.png', price: 1200, category_id: 1,
                description: [
                    { id: 1, title: 'Оперативная память', descr: '8 гб' },
                    { id: 2, title: 'Камера', descr: '50 мп' },
                    { id: 3, title: 'Процессор', descr: 'test' },
                    { id: 4, title: 'Количество ядер', descr: '8' },
                    { id: 5, title: 'Аккумулятор', descr: '5000' },
                ]
            },
            {
                id: 2, name: 'honor', photo: '/cardPhoto2.png', price: 2348, category_id: 1,
                description: [
                    { id: 1, title: 'Оперативная память', descr: '13 гб' },
                    { id: 2, title: 'Камера', descr: 'asdfsd' },
                    { id: 3, title: 'Процессор', descr: 'test' },
                    { id: 4, title: 'Количество ядер', descr: '8' },
                    { id: 5, title: 'Аккумулятор', descr: 'asdfsdaf' },
                ]
            },
            {
                id: 3, name: 'суп', photo: '/cardPhoto.png', price: 5446, category_id: 2,
                description: [
                    { id: 1, title: 'Вкус', descr: 'Вкусный' },
                    { id: 2, title: 'Вес', descr: '500 гр' },
                    { id: 3, title: 'Мясо', descr: 'vyas' }
                ]
            },
            {
                id: 4, name: 'колбаса', photo: '/cardPhoto2.png', price: 78678, category_id: 2,
                description: [
                    { id: 1, title: 'asdas', descr: '832312' },
                    { id: 2, title: 'test', descr: '12321' },
                    { id: 3, title: 'Пtst', descr: 'test' },
                    { id: 4, title: 'Количество ядер', descr: '8' },
                ]
            },
            {
                id: 5, name: 'xiaomi', photo: '/cardPhoto.png', price: 5454, category_id: 1,
                description: [
                    { id: 1, title: 'Оперативная память', descr: '8 гб' },
                    { id: 2, title: 'Кwerwe', descr: '50 мп' },
                    { id: 3, title: 'test', descr: 'test' },
                    { id: 4, title: 'Количество ядер', descr: '8' },
                    { id: 5, title: 'tsts1212', descr: '5asdfsd0' },
                ]
            },
            {
                id: 6, name: 'мяч', photo: '/cardPhoto.png', price: 2323, category_id: 3,
                description: [
                    { id: 1, title: 'Оперasdfsdafть', descr: '8asdf' },
                    { id: 2, title: 'Камера', descr: '12312312' },
                    { id: 3, title: 'Процессор', descr: 'test' },
                    { id: 4, title: 'Кasdf', descr: '8' },
                    { id: 5, title: 'Аккfasdfsdр', descr: '5asdf0' },
                ]
            },
        ]

        this._basket = []

        // this._basket = [{
        //     id: 1, name: 'iphone', photo: '/cardPhoto.png', price: 1200, category_id: 1,
        //     description: [
        //         { id: 1, title: 'Оперативная память', descr: '8 гб' },
        //         { id: 2, title: 'Камера', descr: '50 мп' },
        //         { id: 3, title: 'Процессор', descr: 'test' },
        //         { id: 4, title: 'Количество ядер', descr: '8' },
        //         { id: 5, title: 'Аккумулятор', descr: '5000' },
        //     ]
        // },
        // {
        //     id: 2, name: 'honor', photo: '/cardPhoto2.png', price: 2348, category_id: 1,
        //     description: [
        //         { id: 1, title: 'Оперативная память', descr: '13 гб' },
        //         { id: 2, title: 'Камера', descr: 'asdfsd' },
        //         { id: 3, title: 'Процессор', descr: 'test' },
        //         { id: 4, title: 'Количество ядер', descr: '8' },
        //         { id: 5, title: 'Аккумулятор', descr: 'asdfsdaf' },
        //     ]
        // }]
        this._selectedCategory = NaN
        this._selectedProduct = NaN
        this._favorites = []

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

    addToBasket(product: IProduct) {
        this._basket.push(product);
    }

    removeFromBasket(productId: number) {
        this._basket = this._basket.filter(product => product.id !== productId);
    }

    addToFavorites(product: IProduct){
        this._favorites.push(product)
    }

    removeFromFavorites(productId: number){
        this._favorites = this._favorites.filter(product => product.id !== productId)
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

    get favorites(){
        return this._favorites
    }
}