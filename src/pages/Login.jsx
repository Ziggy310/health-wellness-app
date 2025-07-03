import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Login = () => {
  // Pre-filled for testing
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [errors, setErrors] = useState({});
  const [autoLoginMessage, setAutoLoginMessage] = useState('Logging in automatically for testing...');
  const { login, isLoading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-login for testing purposes
  useEffect(() => {
    const autoLogin = async () => {
      try {
        setAutoLoginMessage('Logging in automatically for testing...');
        // Simulate successful login
        const result = await login(email, password);
        if (result.success) {
          setAutoLoginMessage('Login successful! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/onboarding');
          }, 1000);
        }
      } catch (err) {
        console.log('Auto-login failed, please log in manually');
        setAutoLoginMessage('Auto-login failed. Please log in manually with the pre-filled credentials.');
      }
    };
    
    // Trigger auto-login
    autoLogin();
  }, [login, navigate, email, password]);
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/dashboard";

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const result = await login(email, password);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrors({ form: result.error || 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Auto-login notification */}
      {autoLoginMessage && (
        <div className="fixed top-4 left-0 right-0 mx-auto w-full max-w-md bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center justify-center shadow-md">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{autoLoginMessage}</span>
          </div>
        </div>
      )}
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-600">Meno+</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to access your personalized menopause support</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.form && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
              <span>{errors.form}</span>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;