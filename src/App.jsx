import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseAppProvider } from './contexts/SupabaseAppContext';
import { AppProvider } from './contexts/AppContext';
import { HeadsUpProvider } from './contexts/HeadsUpContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthModal from './components/auth/AuthModal';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MealPlan from './pages/MealPlan';
import FAQ from './pages/FAQ';
import MealDetail from './pages/MealDetail';
import EditDietaryPreferences from './pages/EditDietaryPreferences';
import MyFavorites from './pages/MyFavorites';
import Profile from './pages/Profile';
import ReliefTools from './pages/ReliefToolsFixed';
import SymptomTrackerEnhanced from './pages/SymptomTrackerEnhanced';
import Community from './pages/Community';
import EducationalResources from './pages/EducationalResources';
import OfflineResources from './pages/OfflineResources';
import Bookmarks from './pages/Bookmarks';
import SubscriptionPage from './pages/SubscriptionPage';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' });
  const { isAuthenticated, isOnboarded, loading } = useAuth();

  const openAuthModal = (mode = 'signin') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'signin' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                onAuthClick={openAuthModal}
                isAuthenticated={isAuthenticated}
              />
            } 
          />
          
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <OnboardingFlow />
              </ProtectedRoute>
            } 
          />
          
          {/* Direct onboarding access for testing */}
          <Route 
            path="/test-onboarding" 
            element={
              <ProtectedRoute>
                <OnboardingFlow />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/meal-plan" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <MealPlan />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/meal/:slug" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <MealDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/edit-dietary-preferences" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <EditDietaryPreferences />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-favorites" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <MyFavorites />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/relief" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <ReliefTools />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/symptoms" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <SymptomTrackerEnhanced />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/community" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <Community />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/resources" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <EducationalResources />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/offline-resources" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <OfflineResources />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/bookmarks" 
            element={
              <ProtectedRoute requireOnboarding={false}>
                <Bookmarks />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/subscription" 
            element={<SubscriptionPage />} 
          />

          <Route 
            path="/faq" 
            element={<FAQ />} 
          />

          {/* Catch-all route */}
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>

        <AuthModal 
          isOpen={authModal.isOpen} 
          onClose={closeAuthModal}
          initialMode={authModal.mode}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SupabaseAppProvider>
        <AppProvider>
          <SubscriptionProvider>
            <HeadsUpProvider>
              <FavoritesProvider>
              <AppContent />
              </FavoritesProvider>
            </HeadsUpProvider>
          </SubscriptionProvider>
        </AppProvider>
      </SupabaseAppProvider>
    </AuthProvider>
  );
}

export default App;