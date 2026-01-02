# API Testing Guide

This guide provides example requests for testing the Issue Tracker API using tools like Postman, Thunder Client, or curl.

## Base URL
```
http://localhost:5000
```

## 1. Health Check

### Check Server Status
```http
GET http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-02T09:09:31.000Z"
}
```

---

## 2. User Authentication

### Register a New User
```http
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "email": "john.doe@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "email": "john.doe@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

> **Note:** Save the token from the response. You'll need it for all subsequent requests.

---

## 3. Issue Management

> **Important:** All issue endpoints require authentication. Include the token in the Authorization header:
> ```
> Authorization: Bearer YOUR_TOKEN_HERE
> ```

### Create a New Issue
```http
POST http://localhost:5000/api/issues
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Login page not responding",
  "description": "Users are unable to login. The login button does not respond when clicked.",
  "priority": "High",
  "severity": "Critical"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "title": "Login page not responding",
    "description": "Users are unable to login...",
    "status": "Open",
    "priority": "High",
    "severity": "Critical",
    "createdBy": "65a1b2c3d4e5f6g7h8i9j0k1",
    "createdAt": "2026-01-02T09:10:00.000Z",
    "updatedAt": "2026-01-02T09:10:00.000Z"
  }
}
```

### Get All Issues (with Pagination)
```http
GET http://localhost:5000/api/issues?page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Issues retrieved successfully",
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "Login page not responding",
      "description": "Users are unable to login...",
      "status": "Open",
      "priority": "High",
      "severity": "Critical",
      "createdBy": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "email": "john.doe@example.com"
      },
      "createdAt": "2026-01-02T09:10:00.000Z",
      "updatedAt": "2026-01-02T09:10:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Search Issues
```http
GET http://localhost:5000/api/issues?search=login
Authorization: Bearer YOUR_TOKEN_HERE
```

### Filter Issues by Status
```http
GET http://localhost:5000/api/issues?status=Open
Authorization: Bearer YOUR_TOKEN_HERE
```

### Filter Issues by Priority
```http
GET http://localhost:5000/api/issues?priority=High
Authorization: Bearer YOUR_TOKEN_HERE
```

### Combined Filters
```http
GET http://localhost:5000/api/issues?status=Open&priority=High&page=1&limit=5&sortBy=createdAt&order=desc
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get Issue Status Counts
```http
GET http://localhost:5000/api/issues/counts
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
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

### Get Single Issue by ID
```http
GET http://localhost:5000/api/issues/65a1b2c3d4e5f6g7h8i9j0k2
Authorization: Bearer YOUR_TOKEN_HERE
```

### Update an Issue
```http
PUT http://localhost:5000/api/issues/65a1b2c3d4e5f6g7h8i9j0k2
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Login page fixed",
  "status": "In Progress",
  "priority": "Medium"
}
```

### Mark Issue as Resolved
```http
PATCH http://localhost:5000/api/issues/65a1b2c3d4e5f6g7h8i9j0k2/resolve
Authorization: Bearer YOUR_TOKEN_HERE
```

### Mark Issue as Closed
```http
PATCH http://localhost:5000/api/issues/65a1b2c3d4e5f6g7h8i9j0k2/close
Authorization: Bearer YOUR_TOKEN_HERE
```

### Delete an Issue
```http
DELETE http://localhost:5000/api/issues/65a1b2c3d4e5f6g7h8i9j0k2
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Query Parameters Reference

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Filters
- `search` - Search in title and description
- `status` - Filter by status: `Open`, `In Progress`, `Resolved`, `Closed`
- `priority` - Filter by priority: `Low`, `Medium`, `High`, `Critical`
- `severity` - Filter by severity: `Minor`, `Major`, `Critical`

### Sorting
- `sortBy` - Field to sort by (default: `createdAt`)
- `order` - Sort order: `asc` or `desc` (default: `desc`)

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required. Please provide a valid token."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Issue not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Testing Workflow

1. **Start the server**: `npm run dev`
2. **Register a user** using the registration endpoint
3. **Login** to get your JWT token
4. **Copy the token** from the response
5. **Create some issues** with different priorities and statuses
6. **Test filtering** by status, priority, and search
7. **Test pagination** with different page and limit values
8. **Update issues** and change their status
9. **Get status counts** to see the distribution
10. **Delete issues** when done testing

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Issue
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Issue","description":"This is a test","priority":"High"}'
```

### Get Issues
```bash
curl -X GET "http://localhost:5000/api/issues?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
