# CarListKaro - Car Management Platform

CarListKaro is a full-stack web application that allows users to manage and showcase their car inventory. Built with SvelteKit for the frontend and Node.js/Express for the backend, it provides a modern, responsive interface for car dealers and enthusiasts.

## Features

- **User Authentication**
  - Secure registration and login
  - JWT-based authentication
  - Protected routes
  - Automatic token management

- **Car Management**
  - Create car listings with multiple images
  - Update car details and images
  - Delete car listings
  - View detailed car information
  - Image gallery with navigation

- **Image Handling**
  - Support for multiple images per car (up to 10)
  - Image upload to Cloudinary
  - Image gallery with navigation
  - Automatic image optimization
  - Image deletion management

- **Search & Filter**
  - Search across all car fields
  - Filter by car type, company, and dealer
  - Real-time search results
  - Advanced text search capabilities

- **API Documentation**
  - Swagger/OpenAPI documentation
  - Interactive API testing interface
  - Detailed request/response schemas
  - Authentication documentation

## Tech Stack

### Frontend
- SvelteKit
- TypeScript
- TailwindCSS
- Axios
- Lucide Icons
- Svelte Stores
- SvelteKit Routing

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Cloudinary
- Swagger UI
- Multer
- CORS

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- npm or yarn
- Git


The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:9000
- API Documentation: http://localhost:9000/api/docs

## API Documentation

The API documentation is available at `/api/docs` when the server is running. It provides:
- Complete list of endpoints
- Request/response schemas
- Authentication requirements
- Interactive testing interface

### Available Endpoints

#### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

#### Cars
- GET `/api/cars` - List all cars (with optional search)
- POST `/api/cars` - Create new car
- GET `/api/cars/:id` - Get single car
- PUT `/api/cars/:id` - Update car
- DELETE `/api/cars/:id` - Delete car

