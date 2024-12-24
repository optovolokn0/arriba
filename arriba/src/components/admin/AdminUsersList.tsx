import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../http/services/usersService";
import { IUser } from "../../models";
import ConfirmDelete from "../modals/ConfirmDelete";

const AdminUsersList = observer(() => {

    const [users, setUsers] = useState<IUser[]>([])
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await fetchUsers()
                setUsers(response.data)
            } catch (err) {
                console.error(err);
            } 
        };

        loadUsers();
    }, []);

    return (
        <ul className="users__list">
            {users.map((user) => (
                <li key={user.id} className="users__item">
                    <span>Имя: {user.name}</span>
                    <span>Email: {user.email}</span>
                    <span>Роль: {user.role}</span>
                    <div className="btn-container">
                        <button onClick={()=>setConfirmDelete(true)} className="btn users__btn admin__btn-delete">Удалить</button>
                    </div>
                    <ConfirmDelete show={confirmDelete} onHide={() => setConfirmDelete(false)} item={user}/>
                </li>
            ))}
        </ul>
    )
})

export default AdminUsersList