import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

interface modalProps {
    show: boolean,
    onHide (): void 
}

const CreateCategory = ({ show, onHide } : modalProps) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить категорию
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form >
                    <input type="text" placeholder='Введите название категории'/>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
                <Button onClick={onHide}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateCategory