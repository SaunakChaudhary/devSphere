# API Documentation

## Endpoints

### 1. Google Signup
- **URL:** `/auth/google-signup`
- **Method:** `GET`
- **Description:** This endpoint allows users to sign up using their Google account.
- **Query Parameters:**
  - `code` (string): The authorization code received from Google.
- **Example Request:**

- **Responses:**
- **200 OK:**
  ```json
  {
    "message": "Welcome John Doe",
    "user": {
      "email": "johndoe@gmail.com",
      "name": "John Doe",
      "avatar": "https://robohash.org/mail@johndoe@gmail.com",
      "googleId": "1234567890",
      "authProvider": "google"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "message": "Google Code Not Found"
  }
  ```
- **500 Internal Server Error:**
  ```json
  {
    "message": "SERVER ERROR : <error details>"
  }
  ```

### 2. Google Login
- **URL:** `/auth/google-login`
- **Method:** `GET`
- **Description:** This endpoint allows users to log in using their Google account.
- **Query Parameters:**
- [code](http://_vscodecontentref_/0) (string): The authorization code received from Google.
- **Example Request:**

- **Responses:**
- **200 OK:**
  ```json
  {
    "message": "Welcome John Doe",
    "user": {
      "email": "johndoe@gmail.com",
      "name": "John Doe",
      "avatar": "https://robohash.org/mail@johndoe@gmail.com",
      "googleId": "1234567890",
      "authProvider": "google"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "message": "Google Code Not Found"
  }
  ```
- **500 Internal Server Error:**
  ```json
  {
    "message": "SERVER ERROR : <error details>"
  }
  ```

### 3. Manual Login
- **URL:** `/auth/manual-login`
- **Method:** `POST`
- **Description:** This endpoint allows users to log in using their email and password.
- **Request Body:**
```json
{
  "email": "johndoe@gmail.com",
  "password": "password123"
}
```

- **Response Body:**

```json
{
  "message": "Welcome John Doe",
  "user": {
    "email": "johndoe@gmail.com",
    "name": "John Doe",
    "avatar": "https://robohash.org/mail@johndoe@gmail.com",
    "authProvider": "manual"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **400 Bad Request**

```json
{
  "message": "Invalid Credentials"
}
```
- **500 Internal Server Error**
```json
{
  "message": "SERVER ERROR : <error details>"
}
```

### 4. Manual Signup
- **URL:** `/auth/manual-signup`
- **Method:** `POST`
- **Description:** This endpoint allows users to sign up using their email, password, and other details.

- **Request Body:**
```json
{
  "email": "johndoe@gmail.com",
  "password": "password123",
  "name": "John Doe",
  "gitHuburl": "https://github.com/johndoe",
  "linkedInUrl": "https://linkedin.com/in/johndoe"
}
```

- **Responses:**
-   **200 OK :**
```json
{
  "message": "Welcome John Doe",
  "user": {
    "email": "johndoe@gmail.com",
    "name": "John Doe",
    "avatar": "https://robohash.org/mail@johndoe@gmail.com",
    "gitHuburl": "https://github.com/johndoe",
    "linkedInUrl": "https://linkedin.com/in/johndoe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **400 Bad Request:**
```json
{
  "message": "Email Already Exist"
}
```

- **500 Internal Server Error:**
```json
{
  "message": "SERVER ERROR : <error details>"
}
```

### 5. Send OTP Mail
- **URL:** `/auth/send-otp-mail`
- **Method:** `POST`
- **Description:** This endpoint sends an OTP to the user's email for verification.

- **Request Body:**

```json
{
  "email": "johndoe@gmail.com"
}
```
- **Responses : [200 OK
]**

```json
{
  "message": "OTP sent successfully",
  "OTP": "123456"
}
```

- **Responses : [400 OK
]**

```json
{
  "message": "Email Already Exist"
}
```
- **Responses : [500 OK
]**

```json
{
  "message": "SERVER ERROR : <error details>"
}
```

### 6. Get User
- **URL:** `/auth/get-user`
- **Method:** `GET`
- **Description:** his endpoint retrieves the authenticated user's details.
- **Headers:**
Authorization (string): Bearer token for authentication.

- **Example Request :**
```
GET /auth/get-user
Authorization: Bearer <token>
```

- **Responses : [200 OK
]**

```JSON
{
  "user": {
    "email": "johndoe@gmail.com",
    "name": "John Doe",
    "avatar": "https://robohash.org/mail@johndoe@gmail.com",
    "gitHuburl": "https://github.com/johndoe",
    "linkedInUrl": "https://linkedin.com/in/johndoe",
    "role": "user"
  }
}
```

- **Responses : [400 OK
]**

```JSON
{
  "message": "User not found"
}
```
- **Responses : [500 OK
]**
```JSON
{
  "message": "SERVER ERROR : <error details>"
}
```


### 7. Get Hashtags
- **URL:** `/hashtag/get-hashtags`
- **Method:** `GET`
- **Description:** This endpoint retrieves all hashtags.

- **Example Request :**
```
GET /hashtag/get-hashtags
```

- **Responses : [200 OK ]**

```JSON
[
  {
    "_id": "60c72b2f9b1d8e001c8e4b8a",
    "tag": "javascript",
    "count": 10,
    "type": "programming"
  },
  {
    "_id": "60c72b2f9b1d8e001c8e4b8b",
    "tag": "react",
    "count": 8,
    "type": "library"
  }
]
```

- **Responses : [500 OK
]**

```JSON
{
  "message": "SERVER ERROR : <error details>"
}
```



### 8. Add Hashtags to User
- **URL:** `/hashtag/addIntoUserSchema`
- **Method:** `POST`
- **Description:** This endpoint adds hashtags to the authenticated user's schema.
- **Headers:** `Authorization (string):` Bearer token for authentication.
Request Body

- **Example Request :**
```json
{
  "hashtags": ["javascript", "react"]
}
```

- **Responses : [200 OK ]**

```JSON
{
  "user": {
    "_id": "60c72b2f9b1d8e001c8e4b8c",
    "email": "johndoe@gmail.com",
    "name": "John Doe",
    "interest": ["javascript", "react"]
  }
}
```

- **Responses : [400 OK
]**

```JSON
{
  "message": "Please provide userId and hashtags"
}
```

- **Responses : [500 OK
]**

```JSON
{
  "message": "SERVER ERROR : <error details>"
}
```


