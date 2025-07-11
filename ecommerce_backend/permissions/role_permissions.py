DEFAULT_ROLES = {
    'admin': 'Platform Administrator',
    'vendor': 'Product Vendor',
    'writer': 'Upload blogs',
    'instructor': 'Course Instructor',
    'landlord': 'Housing Provider',
    'tenant': 'Housing Seeker',
    'user': 'General Authenticated User',
    'doctor': 'Medical Doctor',
    'student': 'Medical Student',
}

DEFAULT_PERMISSIONS = {
    'create_product': 'Create and manage own products',
    'manage_orders': 'Access and process orders',
    'create_course': 'Create and manage courses',
    'enroll_course': 'Enroll in courses',
    'publish_blog': 'Publish blog articles',
    'post_housing': 'List accommodation',
    'apply_housing': 'Apply for accommodation',
    'access_admin_dashboard': 'Access admin dashboard'
}

ROLE_PERMISSIONS_MAP = {
    'writer': ['publish_blog'],
    'vendor': ['create_product', 'manage_orders'],
    'instructor': ['create_course'],
    'student': ['enroll_course'],
    'landlord': ['post_housing'],
    'tenant': ['apply_housing'],
    'admin': ['access_admin_dashboard', 'manage_orders', 'publish_blog'],
}
