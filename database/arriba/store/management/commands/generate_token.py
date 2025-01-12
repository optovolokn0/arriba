from django.core.management.base import BaseCommand
from store.models import User
from store.views import generate_developer_token

class Command(BaseCommand):
    help = 'Generate a developer token for a user'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email of the developer user')

    def handle(self, *args, **kwargs):
        email = kwargs['email']
        try:
            user = User.objects.get(email=email)
            token = generate_developer_token(user)
            self.stdout.write(self.style.SUCCESS(f"Developer Token: {token}"))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"No user found with email {email}"))