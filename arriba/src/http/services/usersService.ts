
import apiClient from "../apiClient"

export const fetchUsers = async () => {
    return await apiClient.get('api/users/')
}

export const deleteUser = async (id: number) => {
    return await apiClient.delete(`api/users/${id}/`)
}