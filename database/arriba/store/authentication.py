from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from store.models import UserToken
from django.utils.timezone import now

class CustomTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            token_entry = UserToken.objects.get(token=key)
        except UserToken.DoesNotExist:
            raise AuthenticationFailed('Invalid or revoked token.')

        if token_entry.expires_at < now():
            token_entry.delete()
            raise AuthenticationFailed('Token has expired.')

        return (token_entry.user, token_entry)