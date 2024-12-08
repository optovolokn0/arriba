import { useContext, useState } from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { Context } from '../../main'

interface modalProps {
    show: boolean,
    onHide(): void
}

const CreateCategory = ({ show, onHide }: modalProps) => {

    const { product } = useContext(Context)!
    const [category, setCategory] = useState<string>('')

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
                    <input onChange={(e) => setCategory(e.target.value)} value={category} type="text" placeholder='Введите название категории' />
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
                <Button onClick={() => {
                    product.createCategory(category)
                    product.fetchCategories()
                    onHide()
                }}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateCategory