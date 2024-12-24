import React, { useContext, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Context } from "../../main";
import { observer } from "mobx-react-lite";
import { createCharacteristic } from "../../http/services/productService";
import apiClient from "../../http/apiClient";


interface modalProps {
    show: boolean,
    onHide(): void
}

interface characteristicProps {
    name: string,
    value: string,
    char_id: number
}

const CreateProduct = observer(({ show, onHide }: modalProps) => {
    const { user, product } = useContext(Context)!
    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [descr, setDescr] = useState<string>('')
    const [category, setCategory] = useState<number>(NaN)
    const [brand, setBrand] = useState<number>(NaN)
    const [characteristics, setCharacteristics] = useState<characteristicProps[]>([])
    const [file, setFile] = useState<File>()

    const addCharacteristic = () => {
        //эта функция к предыдущим характеристикам добавляет еще одно
        setCharacteristics([...characteristics, { name: '', value: '', char_id: Date.now() }])
    }

    const removeCharacteristic = (id: number) => {
        setCharacteristics(characteristics.filter(i => i.char_id !== id))
    }

    const updateCharacteristic = (id: number, key: "name" | "value", value: string) => {
        setCharacteristics(
            characteristics.map((c) =>
                c.char_id === id ? { ...c, [key]: value } : c
            )
        );
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]); // Сохраняем выбранный файл в состоянии
        }
    };

    const handleSubmit = async () => {
        try {
            //Создаем товар
            const productResponse = await product.createProduct(name, price, descr, [], user.user.id, brand, category)
            const createdProductId: number = productResponse?.data.id

            //Отправляем характеристики
            await Promise.all(
                characteristics.map((char) =>
                    createCharacteristic(createdProductId, {
                        name: char.name,
                        value: char.value,
                    })
                )
            );

            if (!file) {
                return
            }
            const formData = new FormData();
            formData.append("image", file);

            try {
                await apiClient.post(`/api/products/${createdProductId}/add_image/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
            } catch (error) {
                console.error(error);
            }

            product.fetchProducts()
            onHide()
        } catch (error) {
            console.error('Ошибка при добавлении товара и характеристик', error);
        }
    };



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
                    <Dropdown className="mt-2 mb-2" onSelect={(eventKey) => setCategory(eventKey ? parseInt(eventKey) : NaN)}>
                        <Dropdown.Toggle>Выберите категорию</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.categories.map((category) =>
                                <Dropdown.Item key={category.category_id} eventKey={category.category_id}>{category.category_name}</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2" onSelect={((eventKey) => setBrand(eventKey ? parseInt(eventKey) : NaN))}>
                        <Dropdown.Toggle>Выберите бренд</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.brands.map((brand) =>
                                <Dropdown.Item key={brand.brand_id} eventKey={brand.brand_id}>{brand.brand_name}</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <input className="modal__input mt-3" value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Введите название товара" />
                    <input className="modal__input mt-3" value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="Введите стоимость товара" />
                    <input className="modal__input mt-3" value={descr} onChange={e => setDescr(e.target.value)} type="text" placeholder="Введите описание товара" />
                    <input className="mt-3" type="file" onChange={handleFileChange} />
                    <hr />
                    <Button onClick={addCharacteristic}>Добавить новую характеристику</Button>
                    {
                        characteristics.map(char =>
                            <div className="characteristic__container" key={char.char_id}>
                                <input className="modal__input" type="text" value={char.name} onChange={e => updateCharacteristic(char.char_id, "name", e.target.value)} placeholder="Введите название свойства" />
                                <input className="modal__input" type="text" value={char.value} onChange={e => updateCharacteristic(char.char_id, "value", e.target.value)} placeholder="Введите описание свойства" />
                                <button className="btn characteristic__btn" onClick={() => removeCharacteristic(char.char_id)}>Удалить</button>
                            </div>
                        )
                    }
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
                <Button onClick={handleSubmit}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
})

export default CreateProduct