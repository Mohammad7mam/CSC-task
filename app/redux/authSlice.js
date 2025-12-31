import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../services/auth-service';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        return {
          user: result.user,
          token: result.token,
          message: result.message,
        };
      } else {
        return rejectWithValue(result.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'An error occurred during login');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const result = await AuthService.register(userData);
      
      if (result.success) {
        return {
          user: result.user,
          token: result.token,
          message: result.message,
        };
      } else {
        return rejectWithValue(result.message || 'Registration failed');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'An error occurred during registration');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚀 بدء تسجيل الخروج عبر Redux...');
      const result = await AuthService.logout();
      
      if (result.success) {
        return { 
          success: true,
          message: result.message,
          user: result.user
        };
      } else {
        return rejectWithValue(result.message || 'Logout failed');
      }
    } catch (error) {
      console.error('❌ خطأ في تسجيل الخروج عبر Redux:', error);
      return rejectWithValue(error.message || 'An error occurred during logout');
    }
  }
);

// إصلاح: تغيير checkAuthStatus إلى checkAuth
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.checkAuth(); // ✅ تم التصحيح هنا
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.checkAuth();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Authentication check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    isLoggingOut: false,
    isRegistering: false,
    isAuthenticated: false,
    error: null,
    logoutError: null,
    formData: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    touchedFields: {
      email: false,
      password: false,
      firstName: false,
      lastName: false,
    },
    formSubmitted: false,
    loginAttempts: 0,
    lastLoginAttempt: null,
    logoutStatus: 'idle',
  },
  reducers: {
    updateFormData: (state, action) => {
      const fieldName = Object.keys(action.payload)[0];
      state.formData = { ...state.formData, ...action.payload };
      
      if (!state.touchedFields[fieldName]) {
        state.touchedFields[fieldName] = true;
      }
    },
    setFieldTouched: (state, action) => {
      const fieldName = action.payload;
      state.touchedFields[fieldName] = true;
    },
    setAllFieldsTouched: (state) => {
      state.touchedFields = {
        email: true,
        password: true,
        firstName: state.isRegistering ? true : false,
        lastName: state.isRegistering ? true : false,
      };
    },
    resetFormData: (state) => {
      state.formData = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      };
      state.touchedFields = {
        email: false,
        password: false,
        firstName: false,
        lastName: false,
      };
      state.formSubmitted = false;
    },
    setRegisterMode: (state, action) => {
      state.isRegistering = action.payload;
      state.error = null;
      state.touchedFields = {
        email: false,
        password: false,
        firstName: false,
        lastName: false,
      };
      state.formSubmitted = false;
    },
    clearError: (state) => {
      state.error = null;
      state.logoutError = null;
    },
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
      state.lastLoginAttempt = new Date().toISOString();
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setFormSubmitted: (state, action) => {
      state.formSubmitted = action.payload;
    },
    resetTouchedFields: (state) => {
      state.touchedFields = {
        email: false,
        password: false,
        firstName: false,
        lastName: false,
      };
    },
    clearLogoutStatus: (state) => {
      state.logoutStatus = 'idle';
      state.logoutError = null;
    },
    clearAllAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoggingOut = false;
      state.error = null;
      state.logoutError = null;
      state.logoutStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.formSubmitted = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
        state.formData = {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
        };
        state.touchedFields = {
          email: false,
          password: false,
          firstName: false,
          lastName: false,
        };
        state.formSubmitted = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.loginAttempts += 1;
        state.lastLoginAttempt = new Date().toISOString();
        state.formSubmitted = false;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.formSubmitted = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isRegistering = false;
        state.formData = {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
        };
        state.touchedFields = {
          email: false,
          password: false,
          firstName: false,
          lastName: false,
        };
        state.formSubmitted = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.formSubmitted = false;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoggingOut = true;
        state.logoutStatus = 'loading';
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoggingOut = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
        state.logoutStatus = 'succeeded';
        state.error = null;
        console.log('✅ تم تسجيل الخروج بنجاح في Redux:', action.payload);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoggingOut = false;
        state.logoutStatus = 'failed';
        state.logoutError = action.payload;
        console.error('❌ فشل تسجيل الخروج في Redux:', action.payload);
      })
      
      // Check Auth Status - إصلاح: استخدام checkAuth بدلاً من checkAuthStatus
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.token = action.payload.token;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const {
  updateFormData,
  setFieldTouched,
  setAllFieldsTouched,
  resetFormData,
  setRegisterMode,
  clearError,
  incrementLoginAttempts,
  resetLoginAttempts,
  setUser,
  setFormSubmitted,
  resetTouchedFields,
  clearLogoutStatus,
  clearAllAuthState,
} = authSlice.actions;

export default authSlice.reducer;