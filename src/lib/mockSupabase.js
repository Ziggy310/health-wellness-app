import MockAuthService from '../services/MockAuthService.js';

// Mock Supabase client that provides the same interface as the real Supabase client
class MockSupabaseClient {
  constructor() {
    this.auth = new MockAuth();
    this.storage = new MockStorage();
    this.mockData = this.loadMockData();
  }

  // Load mock data from localStorage
  loadMockData() {
    const data = localStorage.getItem('mockSupabase_data');
    return data ? JSON.parse(data) : {
      user_profiles: {},
      dietary_preferences: {},
      health_goals: {},
      symptoms: {},
      mood_logs: {},
      meal_plans: {},
      meal_customizations: {}
    };
  }

  // Save mock data to localStorage
  saveMockData() {
    localStorage.setItem('mockSupabase_data', JSON.stringify(this.mockData));
  }

  // Generate mock ID
  generateId() {
    return 'mock_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Mock database operations
  from(table) {
    return new MockTable(table, this);
  }

  // Mock real-time subscriptions
  channel(name) {
    return new MockChannel(name);
  }
}

// Mock Auth class
class MockAuth {
  constructor() {
    this.mockAuthService = MockAuthService;
  }

  async signUp(options) {
    try {
      const result = await this.mockAuthService.signUp(
        options.email,
        options.password,
        options.options?.data || {}
      );
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  async signInWithPassword(options) {
    try {
      const result = await this.mockAuthService.signIn(options.email, options.password);
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  async signOut() {
    try {
      await this.mockAuthService.signOut();
      return { error: null };
    } catch (error) {
      return { error: { message: error.message } };
    }
  }

  async getUser() {
    try {
      const result = await this.mockAuthService.getCurrentUser();
      return result;
    } catch (error) {
      return { data: { user: null }, error: { message: error.message } };
    }
  }

  async resetPasswordForEmail(email, options = {}) {
    try {
      await this.mockAuthService.resetPassword(email);
      return { data: {}, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  async updateUser(updates) {
    try {
      if (updates.password) {
        const result = await this.mockAuthService.updatePassword(updates.password);
        return { data: result, error: null };
      }
      return { data: { user: this.mockAuthService.currentUser }, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  onAuthStateChange(callback) {
    return this.mockAuthService.onAuthStateChange(callback);
  }
}

// Mock Storage class
class MockStorage {
  from(bucket) {
    return new MockBucket(bucket);
  }
}

// Mock Bucket class
class MockBucket {
  constructor(bucketName) {
    this.bucketName = bucketName;
  }

  async upload(path, file, options = {}) {
    // Simulate file upload
    const mockUrl = `https://mock-storage.supabase.co/storage/v1/object/public/${this.bucketName}/${path}`;
    return {
      data: { path, fullPath: `${this.bucketName}/${path}` },
      error: null
    };
  }

  async download(path) {
    return {
      data: new Blob(['mock file content']),
      error: null
    };
  }

  getPublicUrl(path) {
    return {
      data: {
        publicUrl: `https://mock-storage.supabase.co/storage/v1/object/public/${this.bucketName}/${path}`
      }
    };
  }
}

// Mock Table class for database operations
class MockTable {
  constructor(tableName, client) {
    this.tableName = tableName;
    this.client = client;
    this.query = {
      select: '*',
      filters: [],
      order: null,
      limit: null,
      single: false
    };
  }

  select(columns = '*') {
    this.query.select = columns;
    return this;
  }

  eq(column, value) {
    this.query.filters.push({ type: 'eq', column, value });
    return this;
  }

  neq(column, value) {
    this.query.filters.push({ type: 'neq', column, value });
    return this;
  }

  gt(column, value) {
    this.query.filters.push({ type: 'gt', column, value });
    return this;
  }

  gte(column, value) {
    this.query.filters.push({ type: 'gte', column, value });
    return this;
  }

  lt(column, value) {
    this.query.filters.push({ type: 'lt', column, value });
    return this;
  }

  lte(column, value) {
    this.query.filters.push({ type: 'lte', column, value });
    return this;
  }

  order(column, options = {}) {
    this.query.order = { column, ...options };
    return this;
  }

  limit(count) {
    this.query.limit = count;
    return this;
  }

  single() {
    this.query.single = true;
    return this;
  }

  // Execute the query
  async then(resolve, reject) {
    try {
      // If this is an update operation, execute it
      if (this._isUpdate) {
        const result = await this._executeUpdate();
        if (resolve) resolve(result);
        return result;
      }

      // If this is an insert operation, execute it
      if (this._insertData) {
        const result = await this._executeInsert();
        if (resolve) resolve(result);
        return result;
      }

      // If this is an upsert operation, execute it
      if (this._upsertData) {
        const result = await this._executeUpsert();
        if (resolve) resolve(result);
        return result;
      }

      // Regular select query
      const tableData = this.client.mockData[this.tableName] || {};
      let results = Object.values(tableData);

      // Apply filters
      this.query.filters.forEach(filter => {
        results = results.filter(row => {
          const rowValue = row[filter.column];
          switch (filter.type) {
            case 'eq': return rowValue === filter.value;
            case 'neq': return rowValue !== filter.value;
            case 'gt': return rowValue > filter.value;
            case 'gte': return rowValue >= filter.value;
            case 'lt': return rowValue < filter.value;
            case 'lte': return rowValue <= filter.value;
            default: return true;
          }
        });
      });

      // Apply ordering
      if (this.query.order) {
        results.sort((a, b) => {
          const aVal = a[this.query.order.column];
          const bVal = b[this.query.order.column];
          const ascending = this.query.order.ascending !== false;
          
          if (aVal < bVal) return ascending ? -1 : 1;
          if (aVal > bVal) return ascending ? 1 : -1;
          return 0;
        });
      }

      // Apply limit
      if (this.query.limit) {
        results = results.slice(0, this.query.limit);
      }

      // Return single or array
      const data = this.query.single ? (results[0] || null) : results;
      const response = { data, error: null };
      
      if (resolve) resolve(response);
      return response;
    } catch (error) {
      const response = { data: null, error: { message: error.message } };
      if (reject) reject(response);
      return response;
    }
  }

  // Insert data - returns new instance for method chaining
  insert(data) {
    const newInstance = new MockTable(this.tableName, this.client);
    newInstance.query = { ...this.query };
    newInstance._insertData = data;
    return newInstance;
  }

  // Execute insert operation
  async _executeInsert() {
    try {
      const tableData = this.client.mockData[this.tableName] || {};
      const records = Array.isArray(this._insertData) ? this._insertData : [this._insertData];
      const insertedRecords = [];

      records.forEach(record => {
        const id = record.id || this.client.generateId();
        const newRecord = {
          ...record,
          id,
          created_at: record.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        tableData[id] = newRecord;
        insertedRecords.push(newRecord);
      });

      this.client.mockData[this.tableName] = tableData;
      this.client.saveMockData();

      return {
        data: Array.isArray(this._insertData) ? insertedRecords : insertedRecords[0],
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Update data - returns new instance for method chaining
  update(updates) {
    const newInstance = new MockTable(this.tableName, this.client);
    newInstance.query = { ...this.query };
    newInstance._updateData = updates;
    newInstance._isUpdate = true;
    return newInstance;
  }

  // Execute update operation
  async _executeUpdate() {
    try {
      const tableData = this.client.mockData[this.tableName] || {};
      let updatedRecords = [];

      Object.values(tableData).forEach(row => {
        let shouldUpdate = true;
        
        // Check if row matches filters
        this.query.filters.forEach(filter => {
          const rowValue = row[filter.column];
          switch (filter.type) {
            case 'eq': 
              if (rowValue !== filter.value) shouldUpdate = false;
              break;
            case 'neq': 
              if (rowValue === filter.value) shouldUpdate = false;
              break;
            default: break;
          }
        });

        if (shouldUpdate) {
          const updatedRow = {
            ...row,
            ...this._updateData,
            updated_at: new Date().toISOString()
          };
          tableData[row.id] = updatedRow;
          updatedRecords.push(updatedRow);
        }
      });

      this.client.mockData[this.tableName] = tableData;
      this.client.saveMockData();

      return {
        data: this.query.single ? (updatedRecords[0] || null) : updatedRecords,
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Upsert data - returns new instance for method chaining
  upsert(data) {
    const newInstance = new MockTable(this.tableName, this.client);
    newInstance.query = { ...this.query };
    newInstance._upsertData = data;
    return newInstance;
  }

  // Execute upsert operation
  async _executeUpsert() {
    try {
      const tableData = this.client.mockData[this.tableName] || {};
      const records = Array.isArray(this._upsertData) ? this._upsertData : [this._upsertData];
      const upsertedRecords = [];

      records.forEach(record => {
        let existingRecord = null;
        
        // Try to find existing record by id or unique fields
        if (record.id) {
          existingRecord = tableData[record.id];
        } else if (record.user_id) {
          // For user-specific tables, try to find by user_id
          existingRecord = Object.values(tableData).find(row => row.user_id === record.user_id);
        }

        if (existingRecord) {
          // Update existing record
          const updatedRecord = {
            ...existingRecord,
            ...record,
            updated_at: new Date().toISOString()
          };
          tableData[existingRecord.id] = updatedRecord;
          upsertedRecords.push(updatedRecord);
        } else {
          // Insert new record
          const id = record.id || this.client.generateId();
          const newRecord = {
            ...record,
            id,
            created_at: record.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          tableData[id] = newRecord;
          upsertedRecords.push(newRecord);
        }
      });

      this.client.mockData[this.tableName] = tableData;
      this.client.saveMockData();

      return {
        data: Array.isArray(this._upsertData) ? upsertedRecords : upsertedRecords[0],
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Delete data
  async delete() {
    try {
      const tableData = this.client.mockData[this.tableName] || {};
      let deletedRecords = [];

      Object.values(tableData).forEach(row => {
        let shouldDelete = true;
        
        // Check if row matches filters
        this.query.filters.forEach(filter => {
          const rowValue = row[filter.column];
          switch (filter.type) {
            case 'eq': 
              if (rowValue !== filter.value) shouldDelete = false;
              break;
            case 'neq': 
              if (rowValue === filter.value) shouldDelete = false;
              break;
            default: break;
          }
        });

        if (shouldDelete) {
          deletedRecords.push(row);
          delete tableData[row.id];
        }
      });

      this.client.mockData[this.tableName] = tableData;
      this.client.saveMockData();

      return {
        data: this.query.single ? (deletedRecords[0] || null) : deletedRecords,
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }
}

// Mock Channel class for real-time subscriptions
class MockChannel {
  constructor(name) {
    this.name = name;
    this.callbacks = [];
  }

  on(event, config, callback) {
    this.callbacks.push({ event, config, callback });
    return this;
  }

  subscribe() {
    // Mock subscription - doesn't actually listen to real changes
    console.log(`Mock subscription created for channel: ${this.name}`);
    return {
      unsubscribe: () => {
        console.log(`Mock subscription unsubscribed for channel: ${this.name}`);
      }
    };
  }
}

// Create and export mock Supabase client
const mockSupabase = new MockSupabaseClient();

// Mock auth helpers that match the real ones
export const authHelpers = {
  signUp: async (email, password, metadata = {}) => {
    return await mockSupabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  },

  signIn: async (email, password) => {
    return await mockSupabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    return await mockSupabase.auth.signOut();
  },

  getCurrentUser: async () => {
    return await mockSupabase.auth.getUser();
  },

  resetPassword: async (email) => {
    return await mockSupabase.auth.resetPasswordForEmail(email);
  },

  updatePassword: async (password) => {
    return await mockSupabase.auth.updateUser({ password });
  }
};

// Mock database helpers that match the real ones
export const dbHelpers = {
  userProfile: {
    get: async (userId) => {
      return await mockSupabase.from('user_profiles').select('*').eq('user_id', userId).single();
    },
    upsert: async (profileData) => {
      return await mockSupabase.from('user_profiles').upsert(profileData).select().single();
    }
  },

  dietaryPreferences: {
    get: async (userId) => {
      return await mockSupabase.from('dietary_preferences').select('*').eq('user_id', userId).single();
    },
    upsert: async (preferencesData) => {
      return await mockSupabase.from('dietary_preferences').upsert(preferencesData).select().single();
    }
  },

  healthGoals: {
    get: async (userId) => {
      return await mockSupabase.from('health_goals').select('*').eq('user_id', userId).single();
    },
    upsert: async (goalsData) => {
      return await mockSupabase.from('health_goals').upsert(goalsData).select().single();
    }
  },

  symptoms: {
    getAll: async (userId) => {
      return await mockSupabase.from('symptoms').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    },
    getByDate: async (userId, date) => {
      return await mockSupabase.from('symptoms').select('*').eq('user_id', userId).gte('created_at', `${date}T00:00:00`).lt('created_at', `${date}T23:59:59`).order('created_at', { ascending: false });
    },
    insert: async (symptomData) => {
      return await mockSupabase.from('symptoms').insert(symptomData).select().single();
    },
    update: async (id, updateData) => {
      return await mockSupabase.from('symptoms').update(updateData).eq('id', id).select().single();
    }
  },

  moodLogs: {
    getAll: async (userId) => {
      return await mockSupabase.from('mood_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    },
    getByDate: async (userId, date) => {
      return await mockSupabase.from('mood_logs').select('*').eq('user_id', userId).gte('created_at', `${date}T00:00:00`).lt('created_at', `${date}T23:59:59`).order('created_at', { ascending: false });
    },
    insert: async (moodData) => {
      return await mockSupabase.from('mood_logs').insert(moodData).select().single();
    }
  },

  mealPlans: {
    get: async (userId) => {
      return await mockSupabase.from('meal_plans').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    },
    getCurrent: async (userId) => {
      const today = new Date().toISOString().split('T')[0];
      return await mockSupabase.from('meal_plans').select('*').eq('user_id', userId).lte('start_date', today).gte('end_date', today).single();
    },
    insert: async (mealPlanData) => {
      return await mockSupabase.from('meal_plans').insert(mealPlanData).select().single();
    }
  },

  mealCustomizations: {
    get: async (userId, mealId) => {
      return await mockSupabase.from('meal_customizations').select('*').eq('user_id', userId).eq('meal_id', mealId).single();
    },
    getAll: async (userId) => {
      return await mockSupabase.from('meal_customizations').select('*').eq('user_id', userId);
    },
    upsert: async (customizationData) => {
      return await mockSupabase.from('meal_customizations').upsert(customizationData).select().single();
    }
  }
};

// Mock subscriptions
export const subscriptions = {
  subscribeToSymptoms: (userId, callback) => {
    return mockSupabase.channel('symptoms_changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'symptoms',
      filter: `user_id=eq.${userId}`
    }, callback).subscribe();
  },

  subscribeToMoodLogs: (userId, callback) => {
    return mockSupabase.channel('mood_logs_changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'mood_logs',
      filter: `user_id=eq.${userId}`
    }, callback).subscribe();
  },

  subscribeToMealPlans: (userId, callback) => {
    return mockSupabase.channel('meal_plans_changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'meal_plans',
      filter: `user_id=eq.${userId}`
    }, callback).subscribe();
  }
};

export { mockSupabase as supabase };
export default mockSupabase;