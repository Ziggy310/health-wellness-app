import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../services/AuthService';
import UserProfileService from '../services/UserProfileService';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { user: currentUser } } = await AuthService.getCurrentUser();
        
        if (currentUser && isMounted) {
          setUser(currentUser);
          
          // Load user profile
          try {
            const userProfile = await UserProfileService.getProfile(currentUser.id);
            if (isMounted) {
              setProfile(userProfile);
            }
          } catch (error) {
            console.error('Error loading profile:', error);
            // Don't fail completely if profile loading fails
            if (isMounted) {
              setProfile(null);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user);
            
            try {
              const userProfile = await UserProfileService.getProfile(session.user.id);
              if (isMounted) {
                setProfile(userProfile);
              }
            } catch (error) {
              console.error('Error loading profile after sign in:', error);
              if (isMounted) {
                setProfile(null);
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    setUser,
    setProfile,
    setLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;