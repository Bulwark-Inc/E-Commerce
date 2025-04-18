# Ecommerce Portfolio Project

A fullstack ecommerce web application built with Django/DRF backend and React/Vite frontend.

## Technologies Used

- **Backend**: Django, Django Rest Framework (DRF)
- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **Database**: SQLite (Dev) / PostgreSQL (Prod)
- **Authentication**: JWT

## Features

- User authentication
- Product catalog
- Shopping cart
- Checkout process
- Order management
- Admin dashboard

## Development Setup

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd ecommerce-portfolio

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
cd ecommerce_backend
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend Setup

# Navigate to frontend directory
cd ecommerce-frontend

# Install dependencies
npm install

# Start development server
npm run dev