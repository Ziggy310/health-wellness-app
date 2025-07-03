# Meno+ Backend Services

Backend implementation for Meno+, an AI-powered app supporting women in perimenopause and menopause through personalized, food-first care.

## Setup Instructions

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Setup environment variables:**
   ```
   cp src/.env.example src/.env
   ```
   Then update the `.env` file with your actual API keys and configuration.

3. **Set up Firebase:**
   - Create a Firebase project
   - Download service account key and set the path in your .env file
   - Configure Firestore security rules

4. **Run development server:**
   ```
   npm run dev
   ```

## API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh authentication token

### User Profiles
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/onboarding` - Submit onboarding information

### Symptoms
- `GET /api/symptoms` - Get available symptoms list
- `POST /api/symptoms/record` - Record symptom occurrence
- `GET /api/symptoms/history` - Get symptom history

### Meal Plans
- `GET /api/meals/plans/current` - Get current meal plan
- `POST /api/meals/plans/generate` - Generate new meal plan
- `GET /api/meals/:mealId` - Get meal details

### Relief Tools
- `GET /api/relief/tools` - Get available relief tools
- `GET /api/relief/tools/:toolId` - Get relief tool details
- `POST /api/relief/sessions/start` - Start relief session

### Voice Concierge
- `POST /api/voice/query` - Submit voice query
- `POST /api/voice/meal-explanation` - Get meal explanation

### Grocery Integration
- `GET /api/grocery/providers` - Get available grocery providers
- `GET /api/grocery/shopping-list` - Get current shopping list
- `POST /api/grocery/checkout` - Initiate grocery checkout
