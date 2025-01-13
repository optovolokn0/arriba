
function AccountSettings() {
    return (
        <div className="account__action">
            <h2 className="title">Настройки аккаунта</h2>
            <div className="container">
                <div className="setting-elem">
                    <h3 className="title">ФИО</h3>
                    <input type="text" placeholder="ФИО"/>
                    <button className="btn setting-btn">Изменить</button>
                </div>
                <div className="setting-elem">
                    <h3 className="title">Пол</h3>
                    <input type="text" placeholder="Пол"/>
                    <button className="btn setting-btn">Изменить</button>
                </div>
                <div className="setting-elem">
                    <h3 className="title">Почта</h3>
                    <input type="text" placeholder="Почта"/>
                    <button className="btn setting-btn">Изменить</button>
                </div>
                <div className="setting-elem">
                    <h3 className="title">Пароль</h3>
                    <input type="text" placeholder="Пароль"/>
                    <button className="btn setting-btn">Изменить</button>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings