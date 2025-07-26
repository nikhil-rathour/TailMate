# TailMate

**Live Demo:** [https://tail-mate-kappa.vercel.app/](https://tail-mate-kappa.vercel.app/)

---

TailMate is a full-stack web platform designed for pet lovers and owners. It enables users to:
- Get AI-powered pet care recommendations
- Find and connect with nearby veterinary clinics
- List, adopt, or sell pets
- Create and explore owner and pet dating profiles
- Share and view pet stories
- Chat in real time with other users

With a modern React frontend and a robust Node.js/Express backend, TailMate brings together community, care, and technology for pets and their humans.

---

## 🖼️ Screenshots

<!-- Replace these with actual screenshots or GIFs -->
![Home Page](docs/screenshots/homepage.png)
![Pet Profile](docs/screenshots/pet-profile.png)
![Chat Feature](docs/screenshots/chat.png)

---

## 🚦 Example User Flow

1. **Sign Up / Login**: Authenticate securely with Google using Firebase.
2. **Create Your Profile**: Set up your owner and pet profiles.
3. **Explore & Connect**: Browse pets for adoption/sale, view owner and pet dating profiles.
4. **AI Pet Care**: Get personalized recommendations for your pet's health and activities.
5. **Find Clinics**: Locate nearby veterinary clinics using geolocation.
6. **Share Stories**: Post and view pet stories in the community.
7. **Chat**: Instantly message other users in real time.

---

## 🚀 Features
- **AI Pet Care**: Get personalized pet care recommendations using AI.
- **Nearby Pet Clinics**: Find veterinary clinics and hospitals near you.
- **Pet Management**: List, update, and manage pets for adoption or sale.
- **Owner & Pet Dating**: Social features for pet owners and pets.
- **Stories**: Share and view pet stories.
- **Real-time Chat**: Connect with other users instantly.
- **Authentication**: Secure login with Google via Firebase.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** (via Mongoose)
- **Firebase Admin SDK** (Authentication)
- **Google Cloud Storage** (Image uploads)
- **Socket.io** (Real-time chat)
- **Google Places API** (Clinic search)
- **AI/ML**: Google Generative AI APIs

### Frontend
- **React** (with Vite)
- **React Router**
- **Tailwind CSS**
- **Framer Motion** (Animations)
- **Firebase JS SDK**
- **Socket.io-client**
- **Axios**

---

## 📁 Folder Structure

```
TailMate/
  backend/      # Express API, models, controllers, services
  frontend/     # React app (Vite), components, pages, assets
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Firebase project (for Auth)
- Google Cloud project (for Maps & Storage)

### 1. Clone the repository
```bash
git clone <repo-url>
cd TailMate
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI, Firebase, and Google API keys
npm run dev
```

#### Example `.env` variables:
```
MONGODB_URI=your_mongodb_uri
FIREBASE_PROJECT_ID=your_firebase_project_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_gcp_service_account.json
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔥 Scripts & Commands

### Backend
- `npm run dev` — Start backend with nodemon

### Frontend
- `npm run dev` — Start React app (Vite dev server)
- `npm run build` — Build frontend for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code

---

## 📚 API Documentation

- **Backend API:** See [`backend/Readme.md`](backend/Readme.md) for detailed API endpoints, request/response examples, and authentication flow.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact
For questions or support, contact the project maintainer or open an issue.

---

**Made with ❤️ for pets and their humans!**









