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

For any issues or questions, contact the backend team.
