import { makeAutoObservable } from "mobx"
import { ICategory, IProduct } from "../models"

export default class ProductStore {
    _categories: ICategory[]
    _products: IProduct[]
    _selectedCategory: number
    _basket: IProduct[]

    constructor() {
        this._categories = [
            { id: 1, name: 'Телефоны' },
            { id: 2, name: 'Еда' },
            { id: 3, name: 'Спорт' },
            { id: 4, name: 'Одежда' }
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

        this._basket = [{
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
        }]
        this._selectedCategory = NaN

        makeAutoObservable(this)
    }

    setCategories(categories: ICategory[]) {
        this._categories = categories
    }

    setProducts(products: IProduct[]) {
        this._products = products
    }

    setSelectedCategory(category: number) {
        this._selectedCategory = category
    }

    addToBasket(product: IProduct) {
        this._basket.push(product);
    }

    removeFromBasket(productId: number) {
        this._basket = this._basket.filter(product => product.id !== productId);
    }

    get categories() {
        return this._categories
    }

    get products() {
        return this._products
    }

    get selectedCategory() {
        return this._selectedCategory
    }

    get basket() {
        return this._basket;
    }
}