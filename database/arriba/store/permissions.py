from rest_framework import permissions

class IsAdminOrSeller(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role.name == 'admin' or request.user.role.name == 'seller'
        )

    def has_object_permission(self, request, view, obj):
        if request.user.role.name == 'admin':
            return True
        
        if request.user.role.name == 'seller':
            return True

        return False

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role.name == 'admin':
            return True
        return False

class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'client'
    
class IsClientOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role == 'client' or request.user.role == 'admin')
    
class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff