# EcoQuiz API Documentation

This document provides a comprehensive list of all API endpoints available in the EcoQuiz backend, including request and response structures.

## Base URL
`/api`

---

## Authentication Module

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "user@example.com",
    "password": "password123" (min 6 chars)
  }
  ```
- **Response**:
  - `200 OK`: `{"message": "registered successfully"}` (Sets `access_token` cookie)
  - `400 Bad Request`: `{"error": "error message"}`

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - `200 OK`: `{"message": "logged in successfully"}` (Sets `access_token` cookie)
  - `401 Unauthorized`: `{"error": "error message"}`

### Google Login
- **URL**: `/auth/google`
- **Method**: `GET`
- **Description**: Redirects user to Google OAuth page.

### Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Auth Required**: No (but typically called by authenticated users)
- **Response**:
  - `200 OK`: `{"message": "logged out"}` (Clears `access_token` cookie)

---

## User Module

### Get My Profile
- **URL**: `/users/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`:
    ```json
    {
      "res": {
        "id": "uuid",
        "email": "string",
        "username": "string",
        "avatar": "url_string or null",
        "banner": "url_string or null",
        "created_id": "iso-date"
      }
    }
    ```

### Update Profile
- **URL**: `/users/me`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "username": "string",
    "avater": "string",
    "banner": "string"
  }
  ```
- **Response**:
  - `200 OK`: `{"msg": "success"}`

### Update Avatar
- **URL**: `/users/me/avatar`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**: `multipart/form-data` with field `avatar` (file)
- **Response**:
  - `200 OK`: `{"avatar": "url_string"}`

### Update Banner
- **URL**: `/users/me/banner`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**: `multipart/form-data` with field `banner` (file)
- **Response**:
  - `200 OK`: `{"banner": "url_string"}`

---

## Community Module

### Get All Communities
- **URL**: `/communities/`
- **Method**: `GET`
- **Auth Required**: No
- **Response**:
  - `200 OK`:
    ```json
    {
      "communities": [
        {
          "id": "uuid",
          "name": "string",
          "description": "string",
          "banner": "string",
          "creator_id": "uuid",
          "allow_public_quiz_submission": boolean,
          "created_at": "string",
          "updated_at": "string"
        }
      ]
    }
    ```

### Create Community
- **URL**: `/communities/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string" (optional),
    "banner": "string" (optional),
    "allow_public_quiz_submission": boolean
  }
  ```
- **Response**:
  - `200 OK`: `{"community_id": "uuid"}`

### Get Community By ID
- **URL**: `/communities/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`:
    ```json
    {
      "community": { ...community_details },
      "members": [ { "id", "username", "avatar", "email", "role" } ],
      "quizzes": [ { "id", "creator", "title", "description", ... } ]
    }
    ```

### Join Community
- **URL**: `/communities/:id/join`
- **Method**: `POST`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`: `{"status": "string"}`

### Promote Member
- **URL**: `/communities/:id/members/:userId/promote`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin/Creator only)
- **Response**:
  - `200 OK`: `{"message": "member promoted to admin"}`

### Demote Member
- **URL**: `/communities/:id/members/:userId/demote`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin/Creator only)
- **Response**:
  - `200 OK`: `{"message": "member demoted to member"}`

### Upload Community Banner
- **URL**: `/communities/upload-banner`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**: `multipart/form-data` with field `banner` (file)
- **Response**:
  - `200 OK`: `{"url": "/uploads/banner/filename.ext"}`

---

## Quiz Module

### Create Quiz
- **URL**: `/quizzes/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "community_id": "uuid",
    "title": "string",
    "description": "string",
    "duration_minutes": int,
    "is_published": boolean,
    "questions": [
      {
        "question_text": "string",
        "explanation": "string",
        "correct_answer": "string",
        "order_index": int,
        "options": [
          { "text": "string", "is_correct": boolean }
        ]
      }
    ]
  }
  ```
- **Response**:
  - `201 Created`: `{"quiz_id": "uuid"}`

### Get All Quizzes
- **URL**: `/quizzes/`
- **Method**: `GET`
- **Auth Required**: Yes (returns quizzes user has access to)
- **Response**:
  - `200 OK`: `{"quizzes": [ ...quiz_objects ]}`

### Get Quiz By ID
- **URL**: `/quizzes/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`: Returns detailed quiz information including leaderboard.

### Take Quiz
- **URL**: `/quizzes/:id/take`
- **Method**: `GET`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`: `{"quiz": { "quiz_id", "title", "duration", "questions": [ { "question_id", "question_text", "options" } ] }}`

### Submit Quiz
- **URL**: `/quizzes/:id/submit`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "answers": [
      { "option_id": "uuid", "question_id": "uuid", "answer_text": "string" }
    ],
    "duration_minutes": int
  }
  ```
- **Response**:
  - `200 OK`: `{"result": { ...submission_results }}`

### Toggle Like
- **URL**: `/quizzes/:id/like`
- **Method**: `POST`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`: `{"status": "liked" | "unliked"}`

---

## Comment Module

### Create Comment
- **URL**: `/questions/:id/comments`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "text": "string"
  }
  ```
- **Response**:
  - `201 Created`: `{"id": "uuid"}`

### Delete Comment
- **URL**: `/comments/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`: `{"message": "comment deleted"}`
