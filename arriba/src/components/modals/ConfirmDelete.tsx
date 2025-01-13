import { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { Context } from "../../main";
import { IProduct, IUser } from "../../models";
import { deleteUser } from "../../http/services/usersService";

interface modalProps {
    show: boolean,
    onHide(): void,
    item: IProduct | IUser
}

const ConfirmDelete = ({ show, onHide, item}: modalProps) => {
    const { product } = useContext(Context)!

    const isProduct = (item: IProduct | IUser): item is IProduct => {
        return (item as IProduct).product_price !== undefined
    }

    const handleDelete = () => {
        if (isProduct(item)) {
            product.deleteProduct(item.id)
        } else {
            deleteUser(item.id)
        }
        onHide();
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
                    {
                        isProduct(item) ? "Вы точно хотите удалить этот товар?"
                        :
                        "Вы точно хотите удалить этого пользователя?"
                    }
                    
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button style={{marginRight: "5px"}} onClick={() => handleDelete()}
                    >Да</Button>
                <Button onClick={onHide}>Нет</Button>
            </Modal.Body>
        </Modal>
    )
}

export default ConfirmDelete