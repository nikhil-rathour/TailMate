# AI Pet Care API

## Endpoint: `/api/aipetcare`

### Method: `POST`

### Description
This endpoint provides personalized pet care recommendations based on the provided pet profile. It returns concise, structured advice suitable for frontend consumption.

---

### Request
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

### Response
- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK` – Success, returns recommendations
  - `400 Bad Request` – Missing or invalid `petData`
  - `500 Internal Server Error` – AI response could not be parsed

#### **Success Response Example**
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

#### **Error Response Example**
```json
{
  "error": "pet info is required"
}
```

---

### API Flow
1. **Frontend** sends a POST request to `/aipetcare` with the pet profile in the `petData` object.
2. **Backend** validates the input and forwards the data to the AI service.
3. **AI Service** returns concise, structured recommendations in JSON format.
4. **Backend** parses and returns the JSON response to the frontend.
5. **Frontend** displays the recommendations to the user.

---

For any issues or questions, contact the backend team.
