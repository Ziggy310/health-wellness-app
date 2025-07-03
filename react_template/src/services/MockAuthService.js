// Mock Authentication Service for development without Supabase backend
class MockAuthService {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
    this.authListeners = [];
  }

  // Load users from localStorage
  loadUsers() {
    const users = localStorage.getItem('mockAuth_users');
    return users ? JSON.parse(users) : {};
  }

  // Save users to localStorage
  saveUsers() {
    localStorage.setItem('mockAuth_users', JSON.stringify(this.users));
  }

  // Load current user from localStorage
  loadCurrentUser() {
    const user = localStorage.getItem('mockAuth_currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Save current user to localStorage
  saveCurrentUser(user) {
    if (user) {
      localStorage.setItem('mockAuth_currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('mockAuth_currentUser');
    }
    this.currentUser = user;
  }

  // Generate a mock user ID
  generateUserId() {
    return 'mock_user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Sign up method
  async signUp(email, password, metadata = {}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Check if user already exists
          if (this.users[email]) {
            throw new Error('User already exists');
          }

          // Create new user
          const userId = this.generateUserId();
          const newUser = {
            id: userId,
            email: email,
            user_metadata: {
              first_name: metadata.firstName || '',
              last_name: metadata.lastName || ''
            },
            created_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(), // Auto-confirm for mock
            app_metadata: {},
            aud: 'authenticated',
            role: 'authenticated'
          };

          // Store user
          this.users[email] = {
            ...newUser,
            password: password // In real app, this would be hashed
          };
          this.saveUsers();

          // Set as current user
          this.saveCurrentUser(newUser);

          // Notify listeners
          this.notifyAuthListeners('SIGNED_IN', newUser);

          resolve({
            user: newUser,
            session: {
              access_token: 'mock_access_token_' + userId,
              refresh_token: 'mock_refresh_token_' + userId,
              expires_in: 3600,
              token_type: 'bearer',
              user: newUser
            }
          });
        } catch (error) {
          reject(error);
        }
      }, 1000); // Simulate network delay
    });
  }

  // Sign in method
  async signIn(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = this.users[email];
          
          if (!user || user.password !== password) {
            throw new Error('Invalid login credentials');
          }

          const authUser = {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
            created_at: user.created_at,
            email_confirmed_at: user.email_confirmed_at,
            app_metadata: user.app_metadata,
            aud: user.aud,
            role: user.role
          };

          // Set as current user
          this.saveCurrentUser(authUser);

          // Notify listeners
          this.notifyAuthListeners('SIGNED_IN', authUser);

          resolve({
            user: authUser,
            session: {
              access_token: 'mock_access_token_' + user.id,
              refresh_token: 'mock_refresh_token_' + user.id,
              expires_in: 3600,
              token_type: 'bearer',
              user: authUser
            }
          });
        } catch (error) {
          reject(error);
        }
      }, 800); // Simulate network delay
    });
  }

  // Sign out method
  async signOut() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const previousUser = this.currentUser;
          this.saveCurrentUser(null);
          
          // Notify listeners
          this.notifyAuthListeners('SIGNED_OUT', null);

          resolve({});
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

  // Reset password method
  async resetPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!this.users[email]) {
            throw new Error('User not found');
          }

          // In a real app, this would send an email
          console.log(`Password reset email sent to ${email}`);
          resolve({});
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  // Update password method
  async updatePassword(password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!this.currentUser) {
            throw new Error('No authenticated user');
          }

          // Update password in storage
          const email = this.currentUser.email;
          if (this.users[email]) {
            this.users[email].password = password;
            this.saveUsers();
          }

          resolve({
            user: this.currentUser
          });
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  // Get current user method
  getCurrentUser() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: this.currentUser
          },
          error: null
        });
      }, 100);
    });
  }

  // Auth state change listener
  onAuthStateChange(callback) {
    this.authListeners.push(callback);

    // Immediately call with current state
    setTimeout(() => {
      callback('INITIAL_SESSION', {
        user: this.currentUser,
        session: this.currentUser ? {
          access_token: 'mock_access_token_' + this.currentUser.id,
          refresh_token: 'mock_refresh_token_' + this.currentUser.id,
          expires_in: 3600,
          token_type: 'bearer',
          user: this.currentUser
        } : null
      });
    }, 0);

    // Return unsubscribe function
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
              this.authListeners.splice(index, 1);
            }
          }
        }
      }
    };
  }

  // Notify all auth listeners
  notifyAuthListeners(event, user) {
    const session = user ? {
      access_token: 'mock_access_token_' + user.id,
      refresh_token: 'mock_refresh_token_' + user.id,
      expires_in: 3600,
      token_type: 'bearer',
      user: user
    } : null;

    this.authListeners.forEach(callback => {
      callback(event, { user, session });
    });
  }

  // Clear all mock data (for testing/development)
  clearAllData() {
    localStorage.removeItem('mockAuth_users');
    localStorage.removeItem('mockAuth_currentUser');
    localStorage.removeItem('mockAuth_profiles');
    this.users = {};
    this.currentUser = null;
  }
}

export default new MockAuthService();