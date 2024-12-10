import { makeAutoObservable } from "mobx"
import { loginUser, registerUser } from "../http/services/authService"
import apiClient from "../http/apiClient"
import { IUser } from "../models"


export default class UserStore{
    _isAuth: boolean
    _role: string
    _user: IUser
    constructor() {
        this._isAuth = false
        this._role = 'client'
        this._user = {id: NaN, name: '', email: '', role: '', role_id: ''}
        makeAutoObservable(this)
    }

    setIsAuth(bool: boolean) {
        this._isAuth = bool
    }

    setRole(role: string) {
        this._role = role
    }

    setUser(user: IUser) {
        this._user = user
    }

    get isAuth() {
        return this._isAuth
    }

    get role() {
        return this._role
    }

    get user() {
        return this._user
    }

    async registration(name: string, email: string, password: string, password_confirm: string, role: string) {
        try {
            const response = await registerUser(name, email, password, password_confirm, role);
            this.setIsAuth(true)

            return response.data
        } catch (e) {
            console.log(e);
        }
    }

    async login(email: string, password: string) {
        try {
            await loginUser(email, password);
            this.setIsAuth(true)

            return this.getUserInfo()

        } catch (e) {
            console.log(e)
        }
    }

    async checkAuth() {
        try {
            const response = await apiClient.post(`api/token/refresh/`, { refresh: localStorage.getItem("refresh_token")})
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            this.setIsAuth(true);

            return this.getUserInfo()
        } catch (e) {
            console.log(e);
        }
    }

    async getUserInfo() {
        const profileResponse = await apiClient.get('api/profile/')
        this.setUser(profileResponse.data)      
        return profileResponse.data
    }
}