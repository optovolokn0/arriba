import React, { useContext, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Context } from "../../main";
import { IInfo } from "../../models";
import { observer } from "mobx-react-lite";


interface modalProps {
    show: boolean,
    onHide (): void 
}

const CreateProduct = observer(({show, onHide} : modalProps) => {
    const { product } = useContext(Context)!
    const [info, setInfo] = useState<IInfo[]>([])

    const addInfo = () => {
        setInfo([...info, {title: '', descr: '', id: Date.now()}])
    }

    const removeInfo = (id: number) => {
        setInfo(info.filter(i => i.id !== id))
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить товар
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="modal__form">
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>Выберите категорию</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.categories.map((category) => 
                                <Dropdown.Item key={category.category_id}>{category.category_name}</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>Выберите бренд</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.brands.map((brand) => 
                                <Dropdown.Item key={brand.brand_id}>{brand.brand_name}</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <input className="modal__input mt-3" type="text" placeholder="Введите название товара"/>
                    <input className="modal__input mt-3" type="number" placeholder="Введите стоимость товара" />
                    <input className="mt-3" type="file"/>
                    <hr/>
                    <Button onClick={addInfo}>Добавить новое свойство</Button>
                    {
                        info.map(i => 
                            <div className="info__container" key={i.id}>
                                <input className="modal__input" type="text" placeholder="Введите название свойства"/>
                                <input className="modal__input" type="text" placeholder="Введите описание свойства"/>
                                <button className="btn info__btn" onClick={() => removeInfo(i.id)}>Удалить</button>
                            </div>
                            
                        )
                    }
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
                <Button onClick={onHide}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
})

export default CreateProduct