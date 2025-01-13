import { useContext } from "react";
import { Modal } from "react-bootstrap";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, SELLER_ROUTE, SHOP_ROUTE } from "../../utils/consts";

interface modalEmailProps {
    show: boolean,
    onHide(): void,
    link: string
}

const ConfirmEmail = ({ show, onHide, link }: modalEmailProps) => {
    const { user } = useContext(Context)!
    const history = useNavigate()

    const redirection = async () => {
        const response = await user.getUserInfo()
        if (response.role === 'admin') history(ADMIN_ROUTE)
        else if (response.role === 'seller') history(SELLER_ROUTE)
        else history(SHOP_ROUTE)
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Перейдите по ссылке для подтверждения почты
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <a onClick={() => redirection()} href={link} target={link}>Ссылка</a>
            </Modal.Body>
        </Modal>
    )
}

export default ConfirmEmail