from permissions.role_permissions import HasApprovedRole


class IsHost(HasApprovedRole):
    required_roles = ['host']
