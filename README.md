# Recipe Sharing Platform API

## Overview

This API provides endpoints for a recipe sharing platform, allowing users to perform CRUD operations on recipes. It is developed using Node.js and Express.js, incorporating Object-Oriented Programming (OOP) concepts.

## Features

- **User authentication:** Register and login functionalities with JWT token generation and validation.
- **Profile management:** Update user details and view user information.
- **Recipe CRUD operations:** Create, read, update, and delete recipes.
- **Authentication middleware:** Secure API endpoints with JWT token authentication.

## Environment Setup

1. Ensure you have Node.js and npm installed on your system. You can download Node.js from [here](https://nodejs.org).
2. Verify the installation by running the following commands in your terminal:
   ```bash
   node -v
   npm -v
3. **Install SQLite3 for database management.** You can refer to [this video](https://www.youtube.com/watch?v=L3FwRRx6bqo) for installation instructions.
4. **Install necessary VS Code extensions for SQL-related tasks:**
   - SQLite
   - SQLite3 Editor
   - SQLTools



## API Endpoints

### User Routes

#### Register
- **POST** `/register`
  - Create a new user account.
  - Request Body: `{ name, email, password }`

#### Login
- **POST** `/login`
  - Authenticate user and generate JWT token.
  - Request Body: `{ username, password }`

#### Profile Management
- **POST** `/update-profile`
  - Update user profile information.
  - Request Body: `{ email, ...profileData }`

### Recipe Routes

#### Add Recipe
- **POST** `/add-recipe`
  - Add a new recipe.
  - Request Body: `{ mail, title, description, ingredients, instructions, image_url }`

#### Get Recipe
- **POST** `/get-recipe`
  - Retrieve recipes added by a specific user.
  - Request Body: `{ mail }`

#### Update Recipe
- **POST** `/update-recipe`
  - Update an existing recipe.
  - Request Body: `{ recipe_id, mail, title, description, ingredients, instructions, image_url }`

#### Delete Recipe
- **POST** `/delete-recipe`
  - Delete a recipe.
  - Request Body: `{ recipe_id, mail }`

## Documentation

For detailed API documentation, refer to the API endpoints and request/response formats described above. Additionally, explore the provided codebase for implementation details.
