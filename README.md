# API Gateway Service

This is the central entry point for our flight booking microservices architecture. The API Gateway acts as a reverse proxy, handling authentication, rate limiting, and routing requests to the appropriate backend services.

## What does this service do?

The API Gateway serves as the single point of entry for all client requests. Instead of clients directly calling individual microservices, they interact with this gateway which then routes requests to the correct service. This approach provides several benefits:

- **Centralized Authentication**: All user authentication and JWT token management happens here
- **Rate Limiting**: Prevents API abuse by limiting requests per IP
- **Request Routing**: Routes `/flightService/*` to the Flights microservice and `/bookingService/*` to the Bookings microservice
- **User Management**: Handles user registration, login, and role assignments

## Key Features

### Authentication System
- User registration with email validation and password hashing using bcrypt
- JWT-based login system with configurable token expiry
- Role-based access control with Customer and Admin roles

### Request Proxying
- Seamlessly forwards requests to backend services
- Path rewriting to maintain clean API contracts
- Handles both Flight Service (port 3000) and Booking Service (port 4000)

### Security Features
- Global rate limiting to prevent abuse
- Password validation with regex patterns
- Secure JWT token generation and verification
- Admin-only endpoints for role management

## Project Structure

```
src/
├── config/          # Configuration files (server, winston, swagger)
├── controllers/     # Request handlers for user operations
├── middlewares/     # Authentication, authorization, rate limiting
├── models/         # Sequelize models for User, Role, UserRole
├── repositories/   # Database interaction layer
├── routers/        # API route definitions
├── services/       # Business logic for user management
└── utils/          # Helper functions and error classes
```

## Database Schema

The service uses three main tables:
- **Users**: Stores user credentials and profile info
- **Roles**: Defines available roles (Customer, Admin)
- **User_Roles**: Many-to-many relationship between users and roles

## Environment Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with these variables:
```
PORT=your_port
SALT_ROUNDS=8
JWT_SECRET_KEY=your_secret_key_here
JWT_KEY_EXPIRY=1h
FLIGHT_SERVICE=your_flight_service_here
BOOKING_SERVICE=yout_booking_service_here
```

3. Set up the database:
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

4. Run the development server:
```bash
npm run dev
```

## API Documentation

Once the server is running, you can access the interactive API documentation at:
http://localhost:your_port/api-docs

## Main Endpoints

- `POST /api/v1/users/signup` - Register a new user
- `POST /api/v1/users/signin` - User login
- `POST /api/v1/users/setRole` - Assign roles (Admin only)
- `/flightService/*` - Proxied to Flight Service
- `/bookingService/*` - Proxied to Booking Service

## Architecture Notes

This gateway implements the API Gateway pattern commonly used in microservices architectures. It helps maintain separation of concerns while providing a unified interface for client applications. The service is designed to be stateless and can be horizontally scaled as needed.
