# Issue Tracker Backend API

A comprehensive issue tracking system backend built with Express.js, TypeScript, and MongoDB. This RESTful API provides robust authentication, advanced issue management, and powerful search and filtering capabilities.

## ✨ Features

### 🔐 User Authentication & Authorization

- Secure user registration with email and password
- JWT-based authentication with configurable expiration
- Password hashing using bcrypt (10 salt rounds)
- Protected API routes with middleware authentication
- Token-based session management

### 📋 Issue Management

- Full CRUD operations for issues
- User-specific issue filtering (view only your created issues)
- Rich issue metadata:
  - **Status**: Open, In Progress, Resolved, Closed
  - **Priority**: Low, Medium, High, Critical
  - **Severity**: Minor, Major, Critical
  - Title and detailed description
  - Timestamps for creation and updates
  - Creator tracking

### 🔍 Advanced Features

- **Full-text search** across issue titles and descriptions
- **Multi-criteria filtering** by status, priority, and severity
- **Pagination** with customizable page size
- **Flexible sorting** by any field (ascending/descending)
- **Issue status aggregation** for dashboard analytics
- **Quick status updates** with dedicated resolve/close endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **CORS**: Enabled for cross-origin requests

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

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager
- Git (for cloning the repository)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/dinelkathilina/issue-tracker-be.git
cd issue-tracker-be
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory (see [`.env.example`](.env.example) for reference):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

4. **Build the project**

```bash
npm run build
```

5. **Start the development server**

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 🌐 Deployment

This application can be deployed to various platforms:

#### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure the following:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all variables from `.env.example`
4. Deploy and get your production URL

#### Deploy to Koyeb

1. Create a new app on [Koyeb](https://www.koyeb.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
   - **Port**: 5000
   - **Environment Variables**: Add MongoDB URI and JWT secret
4. Use MongoDB Atlas for your database

> **Note**: For detailed deployment guides, refer to the conversation history or platform-specific documentation.

### 📚 API Documentation

For comprehensive API testing examples and request/response formats, see [`API_TESTING_GUIDE.md`](./API_TESTING_GUIDE.md).

## 📡 API Endpoints

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

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "email": "user@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
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

### Issues (Authentication Required)

> **Note**: All issue endpoints require a valid JWT token in the Authorization header.  
> Issues are filtered by user - you can only view, update, and delete issues you created.

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

#### Get All Issues (with Filtering & Pagination)

```http
GET /api/issues?page=1&limit=10&search=bug&status=Open&priority=High
Authorization: Bearer <token>
```

**Query Parameters:**

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

**Response:**

```json
{
  "success": true,
  "message": "Status counts retrieved successfully",
  "data": {
    "Open": 5,
    "In Progress": 3,
    "Resolved": 2,
    "Closed": 1,
    "total": 11
  }
}
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

## 📊 Response Format

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

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication with configurable expiration
- Protected API routes with authentication middleware
- Input validation and sanitization
- MongoDB injection prevention
- CORS enabled with configurable origins
- Secure error handling (no sensitive data exposure)
- Environment-based configuration

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload (using nodemon)
- `npm run build` - Build TypeScript to JavaScript (outputs to `dist/`)
- `npm start` - Start production server (runs compiled JavaScript)

### Code Quality & Architecture

The project follows industry best practices:

- **TypeScript strict mode** for type safety
- **Layered architecture** (MVC pattern with services)
- **Separation of concerns** (routes → controllers → services → models)
- **Centralized error handling** with custom middleware
- **RESTful API design** principles
- **Modular code structure** for maintainability

### Project Structure Explained

```
src/
├── config/          # Configuration files
│   ├── db.ts        # MongoDB connection setup
│   └── env.ts       # Environment variable validation
├── models/          # Mongoose schemas and models
│   ├── User.ts      # User model with password hashing
│   └── Issue.ts     # Issue model with validation
├── controllers/     # Request handlers (thin layer)
│   ├── userController.ts    # Auth endpoints
│   └── issueController.ts   # Issue CRUD endpoints
├── services/        # Business logic (thick layer)
│   ├── userService.ts       # User operations & JWT
│   └── issueService.ts      # Issue operations & queries
├── middleware/      # Custom middleware
│   ├── auth.middleware.ts        # JWT verification
│   ├── error.middleware.ts       # Global error handler
│   └── validation.middleware.ts  # Input validation
├── routes/          # API route definitions
│   ├── userRoutes.ts   # /api/users routes
│   └── issueRoutes.ts  # /api/issues routes
├── types/           # TypeScript type definitions
│   ├── index.ts        # Shared types and interfaces
│   └── express.d.ts    # Express type extensions
├── utils/           # Helper functions
│   ├── jwt.util.ts     # JWT generation & verification
│   └── validators.ts   # Input validation helpers
└── app.ts          # Application entry point & Express setup
```

## ⚙️ Environment Variables

| Variable         | Description                               | Required | Default               |
| ---------------- | ----------------------------------------- | -------- | --------------------- |
| `PORT`           | Server port number                        | No       | 5000                  |
| `NODE_ENV`       | Environment mode (development/production) | No       | development           |
| `MONGODB_URI`    | MongoDB connection string                 | **Yes**  | -                     |
| `JWT_SECRET`     | Secret key for JWT signing                | **Yes**  | -                     |
| `JWT_EXPIRES_IN` | JWT token expiration time                 | No       | 7d                    |
| `FRONTEND_URL`   | Frontend URL for CORS                     | No       | http://localhost:5173 |

> **Security Note**: Never commit your `.env` file. Use strong, unique values for `JWT_SECRET` in production.

## 🧪 Testing

For detailed API testing instructions with example requests and responses, see:

- [`API_TESTING_GUIDE.md`](./API_TESTING_GUIDE.md) - Comprehensive testing guide with cURL examples

### Quick Test Workflow

1. Start the server: `npm run dev`
2. Register a user via `/api/users/register`
3. Login to get your JWT token
4. Use the token to create, read, update, and delete issues
5. Test filtering, pagination, and search features

## 🔗 Related Resources

- **Frontend Repository**: [issue-tracker-fe](https://github.com/dinelkathilina/issue-tracker-fe) (React + TypeScript + Hero UI)
- **Live Backend**: [https://issue-tracker-be.onrender.com](https://issue-tracker-be.onrender.com)
- **MongoDB Atlas**: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

## 📝 License

ISC

## 👤 Author

**Thilina Dinelka**

---

**Built with ❤️ using Express.js, TypeScript, and MongoDB**
