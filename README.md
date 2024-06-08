Assignment is deploy on the vercel

Application link :- https://wanderonfrontend.vercel.app/login

Please make the .env in the root directory code in the below

### ENV
``` 
MONGOURL='mongodb+srv://anuj:pmujU1WPJ8QXLrwh@demodatabase.qqtcuhe.mongodb.net/authenticationsystem'
PORT=3001
SUPERSECRET='secureuserauthenticationsystem'
```

### Key points
- Creating a database `authenticationsystem`.

### Models
- User Model
```yaml
{ 
  name: {string, mandatory},
  email: {string, mandatory, valid email, unique}, 
  password: {string, mandatory, minLen 8, maxLen 50},
}
```

## User APIs 
### POST /user/register
- Register a user document from request body.
- Payload for the register of the user. The payload should be a JSON object like [this](#successful-user-register-payload-structure)
- Return HTTP status 200 on a succesful user creation. Also return the user document. The response should be a JSON object like [this](#successful-response-structure)
- Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like [this](#error-response-structure)

### POST /user/login
- Allow an user to login with their email and password.
- On a successful login attempt return a JWT token contatining the userId, exp, iat. The response should be a JSON object like [this](#successful-user-login-payload-structure)
- Return HTTP status 200 on a succesful user login. Also return the user document. The response should be a JSON object like [this](#successful-user-login-response-structure)
- If the credentials are incorrect return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-user-login-response-structure)

### GET /user/:userId/profile
- GET a user document from the API.
- On a successful login user are show your details and pass the Authorization token.
- Return HTTP status 200 on a succesful fetch data. Also return the user document. The response should be a JSON object like [this](#successful-user-get-response-structure)

### PUT /user/:userId/profile
- Allow an user to update with their name, email and password. You can update any field data like name, email and password.
- On a successful login user can update your details. The response should be a JSON object like [this](#successful-user-update-payload-structure)
- Return HTTP status 200 on a succesful user update details. Also return the user document. The response should be a JSON object like [this](#successful-user-update-response-structure)


### Authentication
- Make sure all the user routes are protected.

## Payload
### Successful User Register Payload Structure
```yaml 
{
    "name": "Tester",
    "email": "test1@gmail.com",
    "password": "Admin@123@!!"
}

```
## Response
### Successful Response Structure
```yaml
{
    "status": true,
    "message": "User created successfully"
}
```

### Error Response structure
```yaml
{
    "status": false,
    "message": "Email Already Exist"
}
```

## Payload
### Successful User Login Payload Structure
```yaml 
{
    "email": "test1@gmail.com",
    "password": "Admin@123@!!"
}

```
## Response
### Successful User Login Response Structure
```yaml
{
    "status": true,
    "message": "User login successfully",
    "data": {
        "userId": "662a35e295c016e08f31d6b0",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJhMzVlMjk1YzAxNmUwOGYzMWQ2YjAiLCJpYXQiOjE3MTQwNDMzMjguNzkzLCJleHAiOjE3MTQwNDY5Mjh9.j-21gV4c3dbpRjSc0O0tsMtD1zFRnz7P0mH0CZPa6J4"
    }
}
```

### Error User Login Response Structure
```yaml
{
    "status": false,
    "message": "Invalid login Credentials"
}
```
### Successful User Get Response Structure
```yaml
{
    "status": true,
    "message": "User profile details",
    "data": {
        "_id": "6661a3589e6e201efd23c10e",
        "email": "admin@gmail.com",
        "createdAt": "2024-06-06T11:54:00.375Z",
        "updatedAt": "2024-06-06T11:54:00.375Z"
    }
}
```

### Successful User Update Payload Structure
```yaml 
{
    "name": "Admin"
}
```

### Successful User Update Response Structure
```yaml 
{
    "status": true,
    "message": "User profile updated"
}
```
