# Issue Tracker Backend API

A comprehensive issue tracking system backend built with Express.js, TypeScript, and MongoDB.

## Features

- **User Authentication & Authorization**
  - User registration with email and password
  - Secure login with JWT token generation
  - Password hashing using bcrypt
  - Protected routes with JWT authentication

- **Issue Management**
  - Create, read, update, and delete issues
  - Issue fields: title, description, status, priority, severity
  - Status tracking: Open, In Progress, Resolved, Closed
  - Priority levels: Low, Medium, High, Critical
  - Severity levels: Minor, Major, Critical

- **Advanced Features**
  - Full-text search across issue titles and descriptions
  - Filter by status, priority, and severity
  - Pagination for large datasets
  - Sorting by various fields
  - Issue status counts aggregation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt

## Project Structure

```
src/
├── config/          # Database and environment configuration
│   ├── db.ts
│   └── env.ts
├── models/          # Mongoose schemas
│   ├── User.ts
│   └── Issue.ts
├── controllers/     # Request handlers
│   ├── userController.ts
│   └── issueController.ts
├── services/        # Business logic
│   ├── userService.ts
│   └── issueService.ts
├── middleware/      # Custom middleware
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
├── routes/          # API routes
│   ├── userRoutes.ts
│   └── issueRoutes.ts
├── types/           # TypeScript definitions
│   ├── index.ts
│   └── express.d.ts
├── utils/           # Helper functions
│   ├── jwt.util.ts
│   └── validators.ts
└── app.ts          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [<repository-url>](https://github.com/dinelkathilina/issue-tracker-be.git)
cd issue-tracker-be
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

4. Build the project
```bash
npm run build
```

5. Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Issues (All require authentication)

#### Create Issue
```http
POST /api/issues
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Bug in login page",
  "description": "Users cannot login with valid credentials",
  "priority": "High",
  "severity": "Critical"
}
```

#### Get All Issues
```http
GET /api/issues?page=1&limit=10&search=bug&status=Open&priority=High
Authorization: Bearer <token>
```

Query Parameters:
- `search`: Search in title and description
- `status`: Filter by status (Open, In Progress, Resolved, Closed)
- `priority`: Filter by priority (Low, Medium, High, Critical)
- `severity`: Filter by severity (Minor, Major, Critical)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by (default: createdAt)
- `order`: Sort order - asc or desc (default: desc)

#### Get Issue Counts
```http
GET /api/issues/counts
Authorization: Bearer <token>
```

#### Get Single Issue
```http
GET /api/issues/:id
Authorization: Bearer <token>
```

#### Update Issue
```http
PUT /api/issues/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "In Progress",
  "priority": "Medium"
}
```

#### Resolve Issue
```http
PATCH /api/issues/:id/resolve
Authorization: Bearer <token>
```

#### Close Issue
```http
PATCH /api/issues/:id/close
Authorization: Bearer <token>
```

#### Delete Issue
```http
DELETE /api/issues/:id
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Issues retrieved successfully",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- MongoDB injection prevention
- CORS enabled
- Secure error handling

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Code Quality

The project follows:
- TypeScript strict mode
- Layered architecture (MVC pattern)
- Separation of concerns
- Error handling best practices
- RESTful API design principles

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| MONGODB_URI | MongoDB connection string | Required |
| JWT_SECRET | Secret key for JWT | Required |
| JWT_EXPIRES_IN | JWT expiration time | 7d |

## License

ISC

## Author

Your Name
