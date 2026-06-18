# API and Database Design

## 1. Database Collections

### User Collection

Stores user account information.

```javascript
{
  (_id, name, email, password, createdAt);
}
```

### Goal Collection

Stores learning goals associated with users.

```javascript
{
  (_id, title, description, status, deadline, userId);
}
```

### Roadmap Collection

Stores roadmaps and milestones.

```javascript
{
  _id,
  title,
  milestones: [],
  progress,
  userId
}
```

## 2. Entity Relationships

```text
User (1)
 │
 ├──── Goal (Many)
 │
 └──── Roadmap (Many)
```

## 3. Authentication APIs

### Register User

```http
POST /api/auth/register
```

Request

```json
{
  "name": "John",
  "email": "john@gmail.com",
  "password": "password123"
}
```

Response

```json
{
  "success": true,
  "token": "jwt_token"
}
```

---

### Login User

```http
POST /api/auth/login
```

## 4. Goal APIs

| Method | Endpoint       | Description    |
| ------ | -------------- | -------------- |
| GET    | /api/goals     | Retrieve goals |
| POST   | /api/goals     | Create goal    |
| PUT    | /api/goals/:id | Update goal    |
| DELETE | /api/goals/:id | Delete goal    |

## 5. Roadmap APIs

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| GET    | /api/roadmaps     | Retrieve roadmaps |
| POST   | /api/roadmaps     | Create roadmap    |
| PUT    | /api/roadmaps/:id | Update roadmap    |
| DELETE | /api/roadmaps/:id | Delete roadmap    |

## 6. Request Flow

```text
User
 ↓
React Frontend
 ↓
HTTP Request
 ↓
Express API
 ↓
MongoDB Atlas
 ↓
Response
 ↓
Frontend
```

## 7. Error Handling

| Status Code | Meaning               |
| ----------- | --------------------- |
| 200         | Success               |
| 201         | Resource Created      |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 404         | Resource Not Found    |
| 500         | Internal Server Error |
