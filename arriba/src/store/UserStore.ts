import { makeAutoObservable } from "mobx"

export default class UserStore{
    _isAuth: boolean
    _isAdmin: boolean
    _user: object
    constructor() {
        this._isAuth = true
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
}