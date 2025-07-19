# TailMate

## Firebase Authentication Setup

### Overview
TailMate uses Firebase Authentication for user management. The authentication flow works as follows:

1. Users sign in with Google via Firebase Authentication on the frontend
2. Firebase returns a token which is sent to our backend
3. Backend verifies the token using Firebase Admin SDK
4. User information is stored in MongoDB
5. Protected routes require authentication

### Frontend Setup
- Authentication state is managed through React Context API
- Protected routes redirect unauthenticated users to login
- User profile information is fetched from the backend

### Backend Setup
- Firebase Admin SDK verifies tokens
- User data is stored in MongoDB
- Authentication middleware protects routes

### Files Structure
- `frontend/src/context/AuthContext.jsx`: Manages authentication state
- `frontend/src/components/ProtectedRoute.jsx`: Protects routes requiring authentication
- `frontend/src/utils/authUtils.js`: Utility functions for authentication
- `backend/middleware/auth.middleware.js`: Token verification middleware
- `backend/controllers/auth.controller.js`: Authentication logic
- `backend/routes/auth.router.js`: Authentication endpoints