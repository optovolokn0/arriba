import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Context } from "../../main";


interface modalProps {
    show: boolean,
    onHide (): void 
}

const CreateBrand = ({show, onHide} : modalProps) => {

    const {product} = useContext(Context)!
    const [brand, setBrand] = useState<string>('')

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить бренд
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form >
                    <input onChange={(e) => setBrand(e.target.value)} value={brand} type="text" placeholder='Введите название бренда'/>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
                <Button onClick={async () => {
                    await product.createBrand(brand)
                    await product.fetchBrands()
                    onHide()
                }}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateBrand