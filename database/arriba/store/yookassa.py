from yookassa import Payment
import uuid

from .models import Basket

def create_payment_from_basket(user, description="Оплата корзины", return_url="https://arriba.ru.tuna.am"):
    basket = Basket.objects.filter(user=user).first()
    if not basket:
        raise Exception("Корзина пользователя не найдена")
    
    total_price = basket.get_total_price()
    if total_price <= 0:
        raise Exception("Корзина пуста или итоговая стоимость равна 0")

    idempotence_key = str(uuid.uuid4())
    try:
        payment = Payment.create({
            "amount": {
                "value": f"{total_price:.2f}",
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": return_url
            },
            "description": description,
            "metadata": {
                "user_id": user.id 
            }
        }, idempotence_key)
        return payment
    except Exception as e:
        raise Exception(f"Ошибка создания платежа: {e}")