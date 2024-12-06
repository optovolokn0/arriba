import { makeAutoObservable } from "mobx"
import { loginUser, registerUser } from "../http/services/authService"


export default class UserStore{
    _isAuth: boolean
    _isAdmin: boolean
    _user: object
    constructor() {
        this._isAuth = false
        this._isAdmin = false
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(bool: boolean) {
        this._isAuth = bool
    }

    setIsAdmin(bool: boolean) {
        this._isAdmin = bool
    }

    setUser(user: object) {
        this._user = user
    }

    get isAuth() {
        return this._isAuth
    }

    get isAdmin() {
        return this._isAdmin
    }

    get user() {
        return this._user
    }

    async registration(name: string, email: string, password: string, password_confirm: string, role: string) {
        try {
            const response = await registerUser(name, email, password, password_confirm, role);
            console.log(response)
            localStorage.setItem('token', response.data.tokens.access);
            this.setUser(response.data.user);
            this.setIsAuth(true);
        } catch (e) {
            console.log(e);
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await loginUser(email, password);
            console.log(response)
            this.setIsAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e);
        }
    }
}