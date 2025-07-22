# TailMate API Documentation

## 1. AI Pet Care API

### Endpoint: `/api/aipetcare`

#### Method: `POST`

#### Description
This endpoint provides personalized pet care recommendations based on the provided pet profile. It returns concise, structured advice suitable for frontend consumption.

---

#### Request
- **Content-Type:** `application/json`
- **Body Example:**

```json
{
  "petData": {
    "age": 3,
    "petBreed": "Golden Retriever",
    "location": "New York",
    "weightKg": 30,
    "temperature": 22
  }
}
```

| Field         | Type    | Description                       |
|-------------- |---------|-----------------------------------|
| age           | Number  | Pet's age in years                |
| petBreed      | String  | Pet's breed                       |
| location      | String  | City or region                    |
| weightKg      | Number  | Pet's weight in kilograms         |
| temperature   | Number  | Area temperature in Celsius       |

---

#### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK` – Success, returns recommendations
  - `400 Bad Request` – Missing or invalid `petData`
  - `500 Internal Server Error` – AI response could not be parsed

##### **Success Response Example**
```json
{
  "petType": "Dry kibble",
  "food_brands": ["Royal Canin", "Orijen"],
  "food_brand_products_links": [
    "https://www.royalcanin.com/",
    "https://www.orijen.ca/"
  ],
  "workout": "Fetch",
  "walking_km_per_day": 5,
  "meal_grams": 350,
  "meals_per_day": 2,
  "baths_per_month": 2,
  "bath_time": "Weekend",
  "daily_activities": ["Fetch", "Swim"],
  "other_recommendations": "Brush daily"
}
```

##### **Error Response Example**
```json
{
  "error": "pet info is required"
}
```

---

## 2. Nearby Pet Clinics API

### Endpoint: `/api/doctor`

#### Method: `POST`

#### Description
This endpoint finds nearby pet clinics and veterinary hospitals based on the user's location coordinates. It returns detailed information about each clinic including distance, contact information, ratings, and reviews.

---

#### Request
- **Content-Type:** `application/json`
- **Body Example:**

```json
{
  "location": {
    "lat": 23.0841825,
    "lng": 72.5952473
  }
}
```

| Field         | Type    | Description                       |
|-------------- |---------|-----------------------------------|
| location      | Object  | Contains latitude and longitude   |
| lat           | Number  | Latitude coordinate               |
| lng           | Number  | Longitude coordinate              |

---

#### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK` – Success, returns list of clinics
  - `400 Bad Request` – Missing or invalid location data
  - `500 Internal Server Error` – Failed to fetch clinic data

##### **Success Response Example**
```json
{
  "success": true,
  "result": [
    {
      "hospital_name": "Dr.Gautam's Dog Clinic And Hospital",
      "hospital_address": "Swastik park society B/H nirma university I.O.C, 26, Tragad Rd, Chandkheda, Ahmedabad",
      "hospital_google_maps_link": "https://www.google.com/maps/place/?q=place_id:ChIJKU2vRUSDXjkRM1Omi_7z-os",
      "distance_km": 2.5,
      "contact_number": "+91 98765 43210",
      "rating": 4.6,
      "reviews": [
        {
          "author_name": "John Doe",
          "rating": 5,
          "text": "Excellent care for my pet!"
        }
      ],
      "open_hours": ["Monday: 9:00 AM – 8:00 PM", "Tuesday: 9:00 AM – 8:00 PM"],
      "services": ["General Care", "Vaccination", "Surgery"]
    }
  ]
}
```

##### **Error Response Example**
```json
{
  "success": false,
  "error": "Valid location { lat, lng } is required"
}
```

---

#### API Flow
1. **Frontend** sends a POST request to `/api/aidoctor/doctor` with the user's location coordinates.
2. **Backend** validates the input and searches for nearby pet clinics using Google Places API.
3. **Backend** calculates the distance between the user and each clinic.
4. **Backend** fetches additional details for each clinic (contact number, reviews, etc.).
5. **Backend** sorts the results by distance and returns them to the frontend.
6. **Frontend** displays the list of nearby clinics to the user.

---

## 3. Geocoding API

### Endpoint: `/maps/get-coordinates`

#### Method: `GET`

#### Description
Converts a text address into geographic coordinates (latitude and longitude).

#### Query Parameters
- `address`: The address to geocode (e.g., "Ahmedabad")

#### Response
```json
{
  "coordinates": {
    "ltd": 23.0841825,
    "lng": 72.5952473
  }
}
```

---

## 4. Pet Management API

### Overview
The Pet Management API allows users to create, read, update, and delete pet listings. All pets are associated with an owner (authenticated user) and can be listed for adoption or sale.

### Base URL: `/api/pets`

### Pet Model Schema

| Field         | Type     | Required | Description                                |
|---------------|----------|----------|--------------------------------------------|
| name          | String   | Yes      | Pet's name                                 |
| type          | String   | Yes      | Pet type (dog, cat, bird, small)           |
| gender        | String   | Yes      | Pet gender (male, female)                  |
| breed         | String   | Yes      | Pet's breed                                |
| age           | Number   | Yes      | Pet's age in years                         |
| location      | String   | Yes      | Pet's location                             |
| img           | String   | Yes      | URL to pet's image                         |
| listingType   | String   | Yes      | Type of listing (adoption, sale)           |
| price         | Number   | No       | Price (required if listingType is "sale")  |
| owner         | ObjectId | Yes      | Reference to User model                    |
| description   | String   | Yes      | Detailed description of the pet            |
| createdAt     | Date     | Auto     | Creation timestamp                         |
| updatedAt     | Date     | Auto     | Last update timestamp                      |

---

### Endpoints

#### 1. Get All Pets

##### Endpoint: `/api/pets/pets`

##### Method: `GET`

##### Description
Retrieves a list of all available pets.

##### Authentication
No authentication required.

##### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK` – Success, returns list of pets
  - `400 Bad Request` – Error occurred during retrieval

##### Success Response Example
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Max",
      "type": "dog",
      "gender": "male",
      "breed": "Golden Retriever",
      "age": 3,
      "location": "New York",
      "img": "https://example.com/pet-image.jpg",
      "listingType": "adoption",
      "description": "Friendly and energetic dog looking for a new home",
      "owner": "60d21b4667d0d8992e610c80",
      "createdAt": "2023-06-22T18:30:00.000Z",
      "updatedAt": "2023-06-22T18:30:00.000Z"
    }
  ]
}
```

---

#### 2. Get Pet by ID

##### Endpoint: `/api/pets/pets/:id`

##### Method: `GET`

##### Description
Retrieves a specific pet by its ID.

##### Authentication
No authentication required.

##### URL Parameters
- `id`: Pet ID

##### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK` – Success, returns pet details
  - `404 Not Found` – Pet not found
  - `400 Bad Request` – Error occurred during retrieval

##### Success Response Example
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Max",
    "type": "dog",
    "gender": "male",
    "breed": "Golden Retriever",
    "age": 3,
    "location": "New York",
    "img": "https://example.com/pet-image.jpg",
    "listingType": "adoption",
    "description": "Friendly and energetic dog looking for a new home",
    "owner": "60d21b4667d0d8992e610c80",
    "createdAt": "2023-06-22T18:30:00.000Z",
    "updatedAt": "2023-06-22T18:30:00.000Z"
  }
}
```

---

#### 3. Add New Pet

##### Endpoint: `/api/pets/add-pet`

##### Method: `POST`

##### Description
Creates a new pet listing. Now supports image upload via multipart/form-data. The image is stored in Google Cloud Storage and the public URL is saved in the pet document.

##### Authentication
Firebase token required (Bearer token).

##### Request
- **Content-Type:** `multipart/form-data`
- **Headers:**
  - `Authorization`: `Bearer <firebase_token>`
- **Body Example:**
  - Fields: name, type, gender, breed, age, location, listingType, description, etc.
  - File: `img` (the image file)

##### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `201 Created` – Success, pet created
  - `400 Bad Request` – Invalid input data
  - `401 Unauthorized` – Missing or invalid token

##### Success Response Example
```json
{
  "success": true,
  "message": "Pet added successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Max",
    "type": "dog",
    "gender": "male",
    "breed": "Golden Retriever",
    "age": 3,
    "location": "New York",
    "img": "https://storage.googleapis.com/tailmate-images/1681234567890-max.jpg",
    "listingType": "adoption",
    "description": "Friendly and energetic dog looking for a new home",
    "owner": "60d21b4667d0d8992e610c80",
    "createdAt": "2023-06-22T18:30:00.000Z",
    "updatedAt": "2023-06-22T18:30:00.000Z"
  }
}
```

---

#### 4. Update Pet

##### Endpoint: `/api/pets/update-pet/:id`

##### Method: `PUT`

##### Description
Updates an existing pet listing. Only the pet owner can update their pet.

##### Authentication
Firebase token required (Bearer token).

##### URL Parameters
- `id`: Pet ID

##### Request
- **Content-Type:** `application/json`
- **Headers:**
  - `Authorization`: `Bearer <firebase_token>`
- **Body Example:**

```json
{
  "name": "Max",
  "age": 4,
  "description": "Updated description for Max"
}
```

##### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK` – Success, pet updated
  - `400 Bad Request` – Invalid input data
  - `401 Unauthorized` – Missing or invalid token
  - `403 Forbidden` – Not authorized to update this pet
  - `404 Not Found` – Pet not found

##### Success Response Example
```json
{
  "success": true,
  "message": "Pet updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Max",
    "type": "dog",
    "gender": "male",
    "breed": "Golden Retriever",
    "age": 4,
    "location": "New York",
    "img": "https://example.com/pet-image.jpg",
    "listingType": "adoption",
    "description": "Updated description for Max",
    "owner": "60d21b4667d0d8992e610c80",
    "createdAt": "2023-06-22T18:30:00.000Z",
    "updatedAt": "2023-06-23T10:15:00.000Z"
  }
}
```

---

#### 5. Delete Pet

##### Endpoint: `/api/pets/delete-pet/:id`

##### Method: `DELETE`

##### Description
Deletes a pet listing. Only the pet owner can delete their pet.

##### Authentication
Firebase token required (Bearer token).

##### URL Parameters
- `id`: Pet ID

##### Request
- **Headers:**
  - `Authorization`: `Bearer <firebase_token>`

##### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK` – Success, pet deleted
  - `401 Unauthorized` – Missing or invalid token
  - `403 Forbidden` – Not authorized to delete this pet
  - `404 Not Found` – Pet not found

##### Success Response Example
```json
{
  "success": true,
  "message": "Pet deleted successfully"
}
```

---

## 5. Authentication API

### Overview
TailMate uses Firebase Authentication for user management. The authentication flow works as follows:

1. Users sign in with Google via Firebase Authentication on the frontend
2. Firebase returns a token which is sent to our backend
3. Backend verifies the token using Firebase Admin SDK
4. User information is stored in MongoDB
5. Protected routes require authentication

### Base URL: `/api/auth`

### Authentication Components

#### 1. Auth Middleware (`auth.middleware.js`)

The authentication middleware verifies Firebase ID tokens and attaches the decoded user information to the request object.

```javascript
// Usage in protected routes
router.get('/protected-route', verifyToken, controllerFunction);
```

| Function    | Description                                                  |
|-------------|--------------------------------------------------------------|
| verifyToken | Middleware that validates Firebase tokens in request headers |

#### 2. Auth Controller (`auth.controller.js`)

Handles authentication-related operations including Google authentication and user profile retrieval.

| Function       | Description                                                |
|----------------|------------------------------------------------------------|  
| googleAuth     | Verifies Firebase token and creates/updates user in MongoDB |
| getCurrentUser | Retrieves the current authenticated user's profile         |

#### 3. Auth Router (`auth.router.js`)

Defines authentication-related API endpoints.

#### 4. Auth Utils (`authUtils.js` - Frontend)

Utility functions for handling authentication on the frontend.

| Function    | Description                                                  |
|-------------|--------------------------------------------------------------|
| getAuthToken | Retrieves the current user's Firebase ID token               |
| authFetch    | Creates authenticated fetch requests with the token in header|

---

### Endpoints

#### 1. Google Authentication

##### Endpoint: `/api/auth/google`

##### Method: `POST`

##### Description
Verifies a Firebase ID token and creates or updates the user in the database.

##### Authentication
No authentication required (this is the entry point for authentication).

##### Request
- **Content-Type:** `application/json`
- **Body Example:**

```json
{
  "token": "firebase_id_token_here"
}
```

##### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK` – Success, user authenticated
  - `401 Unauthorized` – Invalid token

##### Success Response Example
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c80",
    "uid": "firebase_user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://example.com/profile.jpg"
  }
}
```

---

#### 2. Get Current User

##### Endpoint: `/api/auth/me`

##### Method: `GET`

##### Description
Retrieves the profile of the currently authenticated user.

##### Authentication
Firebase token required (Bearer token).

##### Request
- **Headers:**
  - `Authorization`: `Bearer <firebase_token>`

##### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK` – Success, returns user profile
  - `401 Unauthorized` – Missing or invalid token
  - `404 Not Found` – User not found
  - `500 Internal Server Error` – Server error

##### Success Response Example
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c80",
    "uid": "firebase_user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://example.com/profile.jpg"
  }
}
```

---

For any issues or questions, contact the backend team.