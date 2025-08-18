# Contract Management System

A comprehensive web application for managing service provider contracts built with FastAPI (backend) and Next.js (frontend).

## 🚀 Features

### Backend (FastAPI)
- **RESTful API** with comprehensive contract and category management
- **Advanced filtering and pagination** with full-text search capabilities
- **Data validation** using Pydantic schemas with proper error handling
- **SQLAlchemy ORM** with SQLite database for easy setup
- **Change tracking** with audit trail for contract modifications
- **Comprehensive test suite** with 70%+ code coverage
- **API documentation** with OpenAPI/Swagger UI

### Frontend (Next.js)
- **Modern React 19** with TypeScript and Next.js 15
- **Responsive design** with Tailwind CSS
- **Real-time data management** with React Context and custom hooks
- **Form validation** using React Hook Form and Zod
- **Advanced filtering and search** with URL state management
- **Comprehensive UI components** with consistent design system
- **Loading states and error handling** throughout the application

## 📋 Contract Features

- ✅ **Contract CRUD operations** (Create, Read, Update, Delete)
- ✅ **Category management** with hierarchical organization
- ✅ **Status tracking** (Draft, Active, Suspended, Terminated, Expired)
- ✅ **Advanced filtering** by supplier, status, category, value range, dates
- ✅ **Full-text search** across contract fields
- ✅ **Pagination and sorting** for large datasets
- ✅ **Change history** with detailed audit trail
- ✅ **Data validation** and business rule enforcement
- ✅ **Responsive dashboard** with key metrics and insights

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL ORM with database abstraction
- **Pydantic** - Data validation and serialization
- **SQLite** - Lightweight database for development
- **Pytest** - Testing framework with fixtures
- **Uvicorn** - ASGI server for production

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with modern features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation for forms
- **Axios** - HTTP client for API communication
- **Jest** - Testing framework for unit tests

## 📦 Project Structure

```
project/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes and dependencies
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic layer
│   │   ├── repositories/   # Data access layer
│   │   └── utils/          # Utility functions
│   ├── tests/              # Test suite
│   ├── migrations/         # Database migrations
│   └── requirements.txt    # Python dependencies
└── frontend/               # Next.js frontend
    ├── app/               # Next.js App Router pages
    ├── components/        # Reusable UI components
    ├── contexts/          # React contexts
    ├── hooks/             # Custom React hooks
    ├── lib/               # Utilities and API client
    └── __tests__/         # Frontend tests
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database:**
   ```bash
   python migrations/init_db.py
   ```

5. **Start the server:**
   ```bash
   python app/main.py
   ```

   Backend will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest                           # Run all tests
pytest --cov                     # Run with coverage
pytest --cov-report=html         # Generate HTML coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                         # Run all tests
npm run test:watch              # Run tests in watch mode
npm run test:coverage           # Run with coverage report
```

## 📊 API Endpoints

### Contracts
- `GET /api/v1/contracts` - List contracts with filtering and pagination
- `POST /api/v1/contracts` - Create new contract
- `GET /api/v1/contracts/{id}` - Get contract details
- `PUT /api/v1/contracts/{id}` - Update contract
- `DELETE /api/v1/contracts/{id}` - Delete contract (requires confirmation)

### Categories
- `GET /api/v1/categories` - List all categories
- `POST /api/v1/categories` - Create new category
- `GET /api/v1/categories/{id}` - Get category details
- `PUT /api/v1/categories/{id}` - Update category
- `DELETE /api/v1/categories/{id}` - Delete category (requires confirmation)

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=sqlite:///./contracts.db
DEBUG=True
PROJECT_NAME=Contract Management API
API_V1_STR=/api/v1
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 🎯 Key Features Demonstrated

### Backend Architecture
- **Clean Architecture** with separation of concerns
- **Repository Pattern** for data access abstraction
- **Service Layer** for business logic
- **Dependency Injection** with FastAPI dependencies
- **Error Handling** with custom exceptions
- **Data Validation** with comprehensive schemas

### Frontend Architecture
- **Component-Based Design** with reusable UI components
- **State Management** with React Context and reducers
- **Custom Hooks** for data fetching and state logic
- **Type Safety** with comprehensive TypeScript interfaces
- **Form Handling** with validation and error states
- **Responsive Design** with mobile-first approach

## 📈 Performance Features

- **Database Indexing** for optimal query performance
- **Pagination** to handle large datasets efficiently
- **Caching** with React state management
- **Loading States** for better user experience
- **Error Boundaries** for graceful error handling
- **Code Splitting** with Next.js automatic optimization

## 🔒 Security Features

- **Data Validation** on both frontend and backend
- **SQL Injection Prevention** with SQLAlchemy ORM
- **XSS Protection** with React built-in security
- **CSRF Protection** with proper API design
- **Input Sanitization** with Pydantic validators

## 📝 Development Guidelines

### Commit Convention
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `test:` - Test additions/modifications
- `refactor:` - Code refactoring
- `style:` - Code style changes
- `chore:` - Maintenance tasks

### Code Style
- **Backend:** Follow PEP 8 Python style guide
- **Frontend:** Follow ESLint and Prettier configurations
- **TypeScript:** Strict mode enabled for type safety
- **Testing:** Minimum 70% code coverage requirement

## 🚀 Production Deployment

### Backend
- Use production ASGI server (Gunicorn + Uvicorn)
- Configure PostgreSQL or MySQL for production database
- Set up environment-specific configuration
- Enable logging and monitoring

### Frontend
- Build optimized production bundle
- Configure CDN for static assets
- Set up environment-specific API URLs
- Enable performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- FastAPI for the excellent Python web framework
- Next.js team for the amazing React framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and the open-source community

---

**Built with ❤️ using modern web technologies**