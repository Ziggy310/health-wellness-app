# Meno+ Health Application

Meno+ is a comprehensive health application designed specifically for women navigating menopause. Using AI technology, the platform provides personalized meal plans, symptom tracking, grocery suggestions, and insightful analytics.

## Features

- **Personalized Meal Planning**: AI-generated meal plans tailored to menopausal symptoms and nutritional needs
- **Symptom Tracking**: Log and monitor menopausal symptoms over time
- **Community Support**: Connect with other users going through similar experiences
- **Educational Resources**: Access curated articles, videos, and podcasts about menopause
- **Data Visualization**: Track progress through comprehensive analytics
- **Subscription Model**: Free trial and premium subscription options

## Project Structure

This repository contains both the frontend and backend components of the Meno+ application:

```
├── meno_plus_backend/     # Node.js backend service
├── react_template/        # React frontend application
```

## Prerequisites

- Node.js (v16 or later)
- npm or pnpm
- MongoDB (for backend database)
- Modern web browser

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd meno_plus_backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root of the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/meno_plus
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd react_template
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   pnpm install
   ```

3. Create a `.env` file in the root of the frontend directory with:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   pnpm run dev
   ```

5. Open a browser and navigate to `http://localhost:5173`

## Deployment

### Backend Deployment

The backend can be deployed to services like Heroku, AWS, or any Node.js hosting platform:

1. Set up environment variables on your hosting platform
2. Deploy the code following the hosting provider's instructions

### Frontend Deployment

The frontend can be deployed using Vercel or any static site hosting:

1. Build the production version:
   ```
   cd react_template
   npm run build
   ```
   or
   ```
   pnpm run build
   ```

2. Follow the deployment instructions in `DEPLOYMENT.md`

## Testing

### Backend Testing
```
cd meno_plus_backend
npm test
```

### Frontend Testing
```
cd react_template
npm run test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/yourusername/meno-plus](https://github.com/yourusername/meno-plus)

## Acknowledgments

- All AI services and integrations
- Contributors to the project
- Research resources on menopause health management