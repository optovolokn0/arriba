import React from "react";
import { Button, Modal } from "react-bootstrap";


interface modalProps {
    show: boolean,
    onHide (): void 
}

const CreateBrand = ({show, onHide} : modalProps) => {
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
                    <input type="text" placeholder='Введите название бренда'/>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
                <Button onClick={onHide}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateBrand