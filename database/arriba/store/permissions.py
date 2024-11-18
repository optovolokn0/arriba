from rest_framework import permissions

class IsAdminOrSeller(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role.name == 'admin' or request.user.role.name == 'seller'
        )

    def has_object_permission(self, request, view, obj):
        if request.user.role.name == 'admin':
            return True
        
        if request.user.role.name == 'seller' and hasattr(obj, 'seller'):
            return obj.seller == request.user

        return False
    

class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'client'
    
class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff