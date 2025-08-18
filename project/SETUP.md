# Setup Instructions

## Quick Setup with Docker

The easiest way to run the entire application:

```bash
# Clone and navigate to project
cd project

# Start both backend and frontend
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Manual Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database:**
   ```bash
   python migrations/init_db.py
   ```

5. **Run tests (optional):**
   ```bash
   pytest --cov
   ```

6. **Start server:**
   ```bash
   python app/main.py
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests (optional):**
   ```bash
   npm test
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Configuration

### Backend Environment Variables

Create `.env` file in backend directory:
```env
DATABASE_URL=sqlite:///./contracts.db
DEBUG=True
PROJECT_NAME=Contract Management API
API_V1_STR=/api/v1
```

### Frontend Environment Variables

Create `.env.local` file in frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Database Setup

The SQLite database will be automatically created when you run the initialization script. Sample data can be added by running:

```bash
cd backend
python seed.py  # If available
```

## Testing

### Backend Tests
```bash
cd backend
pytest                    # Run all tests
pytest --cov             # With coverage
pytest -v                # Verbose output
```

### Frontend Tests
```bash
cd frontend
npm test                  # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process on port 8000 (backend)
   lsof -ti:8000 | xargs kill -9
   
   # Kill process on port 3000 (frontend)
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database permissions:**
   ```bash
   # Ensure write permissions for SQLite
   chmod 664 backend/contracts.db
   ```

3. **Node modules issues:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Python dependencies:**
   ```bash
   cd backend
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

### API Connection Issues

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check CORS configuration:**
   - Ensure frontend URL is allowed in backend CORS settings

3. **Verify environment variables:**
   - Check `NEXT_PUBLIC_API_URL` in frontend
   - Check API endpoints are accessible

## Development Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test:**
   ```bash
   # Test backend
   cd backend && pytest
   
   # Test frontend
   cd frontend && npm test
   ```

3. **Commit with conventional commits:**
   ```bash
   git commit -m "feat: add new feature description"
   ```

4. **Push and create pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Production Deployment

### Backend Production
```bash
cd backend
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Production
```bash
cd frontend
npm run build
npm start
```

### Using Docker for Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build
```

## Need Help?

- Check the main README.md for detailed documentation
- Review API documentation at http://localhost:8000/docs
- Check the issues section for common problems
- Ensure all prerequisites are installed correctly