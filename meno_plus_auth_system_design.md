# Meno+ User Authentication System Design

## Implementation approach
For the Meno+ User Authentication System, we'll leverage the existing Firebase Authentication integration with the following implementation approach:

1. **Backend Authentication**: We'll continue using Firebase Authentication for the backend which provides robust, secure authentication services. The existing backend has routes for registration, login, password reset, and token refresh.

2. **Frontend Integration**: We'll implement a React-based authentication flow with dedicated pages for sign-up, login, password reset, and account management. We'll use React Context API for managing authentication state.

3. **Protected Routes**: We'll implement route protection using React Router to restrict access to authenticated users only for certain pages.

4. **User Experience**: The authentication flow will be designed with a focus on user experience, providing clear feedback and intuitive interfaces throughout the authentication process.

5. **Security Best Practices**: We'll implement security best practices like CSRF protection, secure token storage, and validation of inputs to ensure a secure authentication system.

## Data structures and interfaces

### Backend (Already implemented, shown for reference)
The backend uses Firebase Authentication and Firestore for user data storage. Key data structures include:

- **User Auth Record**: Firebase Authentication user record containing email, password hash, display name, etc.
- **User Document**: Firestore document containing user profile data, subscription info, and app preferences.

### Frontend Data Structures

```javascript
// User Authentication Context State
interface AuthState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

// User Model
interface User {
  uid: string;
  email: string;
  displayName: string;
  subscriptionTier: 'FREE' | 'BASIC' | 'PREMIUM';
  subscriptionExpiryDate: Date | null;
  isActive: boolean;
}

// Auth Context
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyEmail: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}
```

## System Components

### 1. Authentication Context Provider

The AuthProvider will be responsible for managing authentication state and providing authentication methods to the application.

```jsx
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Implement authentication methods: signup, login, logout, resetPassword, etc.
  // These methods will interact with Firebase Auth and our backend API
  
  const value = {
    currentUser,
    isLoading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updateProfile,
    verifyEmail,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
```

### 2. API Service for Authentication

The API service will handle communication with the backend for authentication operations.

```javascript
// src/services/api.js
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const user = firebase.auth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication service methods
const authService = {
  async register(email, password, displayName) {
    // Create user with Firebase Auth
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName });
    
    // Get ID token
    const idToken = await userCredential.user.getIdToken();
    
    // Register with our backend
    return api.post('/api/auth/register', { idToken, email, displayName });
  },
  
  async login(email, password) {
    // Sign in with Firebase Auth
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    
    // Get ID token
    const idToken = await userCredential.user.getIdToken();
    
    // Validate with our backend
    return api.post('/api/auth/login', { idToken });
  },
  
  async resetPassword(email) {
    return api.post('/api/auth/reset-password', { email });
  },
  
  // Other auth-related API methods
};

export { authService };
export default api;
```

### 3. Protected Route Component

A component to protect routes that require authentication.

```jsx
// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ component: Component, ...rest }) {
  const { currentUser, isLoading } = useAuth();
  
  return (
    <Route
      {...rest}
      render={props => {
        if (isLoading) {
          return <div>Loading...</div>;
        }
        
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        );
      }}
    />
  );
}

export default ProtectedRoute;
```

### 4. Authentication Pages

#### Sign Up Page
```jsx
// src/pages/auth/SignUp.jsx
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const history = useHistory();
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setIsLoading(true);
      await signup(email, password, displayName);
      history.push('/dashboard');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="display-name" className="sr-only">Display Name</label>
              <input
                id="display-name"
                name="displayName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
          
          <div className="text-sm text-center">
            Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
```

#### Login Page
```jsx
// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation();
  
  const { from } = location.state || { from: { pathname: '/dashboard' } };
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setIsLoading(true);
      await login(email, password);
      history.replace(from);
    } catch (error) {
      setError('Failed to login: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/reset-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
          
          <div className="text-sm text-center">
            Need an account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
```

#### Password Reset Page
```jsx
// src/pages/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setIsLoading(true);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (error) {
      setError('Failed to reset password: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
        </div>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {message && <div className="text-green-500 text-sm text-center">{message}</div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
          
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
```

#### Account Management Page
```jsx
// src/pages/auth/AccountManagement.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function AccountManagement() {
  const { currentUser, updateProfile, verifyEmail, deleteAccount } = useAuth();
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleUpdateProfile(e) {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setIsLoading(true);
      await updateProfile({ displayName });
      setMessage('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleVerifyEmail() {
    try {
      setMessage('');
      setError('');
      await verifyEmail();
      setMessage('Verification email sent');
    } catch (error) {
      setError('Failed to send verification email: ' + error.message);
    }
  }
  
  async function handleDeleteAccount() {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setMessage('');
        setError('');
        setIsLoading(true);
        await deleteAccount();
        // Redirection will be handled by the auth context
      } catch (error) {
        setError('Failed to delete account: ' + error.message);
        setIsLoading(false);
      }
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Account Management</h1>
      
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      {message && <div className="text-green-500 text-sm mb-4">{message}</div>}
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="display-name">
              Display Name
            </label>
            <input
              id="display-name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <div className="py-2 px-3 bg-gray-100 rounded">
              {currentUser?.email}
              {currentUser?.emailVerified ? (
                <span className="ml-2 text-green-500 text-xs">Verified</span>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="ml-2 text-blue-500 text-xs underline"
                >
                  Verify email
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Subscription Tier: <span className="font-semibold">{currentUser?.subscriptionTier || 'FREE'}</span></p>
          <a href="/subscription" className="text-blue-500 hover:text-blue-700">Manage Subscription</a>
        </div>
        
        <div className="border-t pt-4">
          <button
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete Account
          </button>
          <p className="text-gray-500 text-xs mt-2">This action cannot be undone.</p>
        </div>
      </div>
    </div>
  );
}

export default AccountManagement;
```

## Program call flow

### Authentication Flow

1. User Registration:
   - User provides email, password, and display name
   - Frontend creates Firebase Auth user
   - Backend creates user document in Firestore
   - User is redirected to the dashboard

2. User Login:
   - User provides email and password
   - Firebase Authentication validates credentials
   - Backend validates user account status
   - User is redirected to the dashboard or intended page

3. Password Reset:
   - User requests password reset with email
   - Firebase sends password reset email
   - User sets new password via reset link
   - User is redirected to login

4. Account Management:
   - User can update profile information
   - User can verify email address
   - User can manage subscription
   - User can delete account

## Anything UNCLEAR

Some areas requiring clarification during implementation:

1. Subscription management integration with the authentication system: How will subscription changes affect user authentication and permissions?

2. Social authentication options: Will the system support login with Google, Facebook, or other providers?

3. Multi-factor authentication requirements: Is there a need for additional security through multi-factor authentication?

4. Account deletion process: What happens to user data when an account is deleted? Is there a soft delete option or grace period?

5. User roles and permissions: Will different user types have different access levels, and how will these be managed in the authentication system?