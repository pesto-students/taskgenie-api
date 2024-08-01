

TaskGenie API is the backend service for the TaskGenie platform, a versatile service aggregator where users can list their needs and find task opportunities. This API is built with Node.js, Express, and MongoDB, and it integrates JWT authentication for secure user interactions.

## Features

- **JWT Authentication**: Secure authentication and authorization using JSON Web Tokens (JWT).
- **User Management**: CRUD operations for managing users and their profiles.
- **Task Listings**: API endpoints for creating, reading, updating, and deleting task listings.
- **Database Integration**: MongoDB integration for storing and querying data.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Getting Started

To set up the TaskGenie API locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/taskgenie-api.git
   cd taskgenie-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskgenie
   JWT_SECRET=your_jwt_secret
   ```

   Replace `your_jwt_secret` with a secure secret key for JWT token generation.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. The API server will start running on `http://localhost:5000`.

## API Endpoints

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Login with existing credentials and receive a JWT token.
- **GET /api/tasks**: Retrieve all tasks.
- **POST /api/tasks**: Create a new task.
- **GET /api/tasks/:id**: Retrieve a specific task by ID.
- **PUT /api/tasks/:id**: Update a task by ID.
- **DELETE /api/tasks/:id**: Delete a task by ID.

For detailed API documentation and usage, refer to the [API Documentation](API_DOCS.md).

## Contributing

Contributions are welcome! Here's how you can contribute to the project:

- Fork the repository
- Create your feature branch (`git checkout -b feature/YourFeature`)
- Commit your changes (`git commit -am 'Add some feature'`)
- Push to the branch (`git push origin feature/YourFeature`)
- Create a new Pull Request

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guidelines](CONTRIBUTING.md) while contributing to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JWT implementation for Node.js

---
