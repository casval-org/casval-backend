# CASVAL Backend

This repository contains the backend code for the CASVAL project.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/casval_backend.git
    ```
2. Navigate to the project directory:
    ```sh
    cd casval_backend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Create a `.env` file in the root directory and add your environment variables:
    ```sh
    touch .env
    ```

## Usage

To start the server, run:
```sh
npm start
```

The server will be running on `http://localhost:5001`.

## API Endpoints

### Authentication

- **Login**
    - **URL:** `/api/v1/login`
    - **Method:** `POST`
    - **Description:** Logs in a user.
    - **Body Parameters:**
        - `email` (string, required)
        - `password` (string, required)

- **Register**
    - **URL:** `/api/v1/register`
    - **Method:** `POST`
    - **Description:** Registers a new user.
    - **Body Parameters:**
        - `email` (string, required)
        - `username` (string, required)
        - `password` (string, required)

- **Get Current User**
    - **URL:** `/api/v1/me`
    - **Method:** `GET`
    - **Description:** Retrieves the current logged-in user's information.
    - **Headers:**
        - `Authorization` (string, required)

- **Update Profile**
    - **URL:** `/api/v1/update-profile/:id`
    - **Method:** `PATCH`
    - **Description:** Updates the profile of the user.
    - **Headers:**
        - `Authorization` (string, required)
    - **Body Parameters:**
        - `nickname` (string, optional)
        - `password` (string, optional)

- **Delete User**
    - **URL:** `/api/v1/delete-user/:id`
    - **Method:** `DELETE`
    - **Description:** Deletes a user.
    - **Headers:**
        - `Authorization` (string, required)

### Password Management

- **Forget Password**
    - **URL:** `/api/v1/forget-password`
    - **Method:** `POST`
    - **Description:** Sends a password reset code to the user's email.
    - **Body Parameters:**
        - `email` (string, required)

- **Reset Code Check**
    - **URL:** `/api/v1/reset-code-check`
    - **Method:** `POST`
    - **Description:** Checks the reset code sent to the user's email.
    - **Body Parameters:**
        - `email` (string, required)
        - `code` (string, required)

- **Reset Password**
    - **URL:** `/api/v1/reset-password`
    - **Method:** `POST`
    - **Description:** Resets the user's password.
    - **Body Parameters:**
        - `password` (string, required)
        - `temporaryToken` (string, required)

### User Management

- **Get User by ID**
    - **URL:** `/api/v1/get-user/:id`
    - **Method:** `GET`
    - **Description:** Retrieves a user by their ID.
    - **Headers:**
        - `Authorization` (string, required)

- **Get All Users**
    - **URL:** `/api/v1/get-users`
    - **Method:** `GET`
    - **Description:** Retrieves all users.
    - **Headers:**
        - `Authorization` (string, required)

## Error Handling

Errors are handled using a custom error handler middleware. The `APIError` class is used to throw errors with specific status codes and messages.

## License

This project is licensed under the ISC License.