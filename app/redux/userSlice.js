// store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async Thunks
export const loadUserData = createAsyncThunk(
  'user/loadUserData',
  async () => {
    try {
      const userJson = await AsyncStorage.getItem('current_user');
      
      if (userJson) {
        const user = JSON.parse(userJson);
        return {
          name: user.firstName || user.fullName || 'User',
          email: user.email,
          uid: user.uid,
          // يمكنك إضافة المزيد من الحقول حسب الحاجة
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
);

export const updateUserName = createAsyncThunk(
  'user/updateUserName',
  async (newName) => {
    try {
      // تحديث AsyncStorage
      const userJson = await AsyncStorage.getItem('current_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        user.firstName = newName;
        await AsyncStorage.setItem('current_user', JSON.stringify(user));
      }
      return newName;
    } catch (error) {
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: '',
    uid: '',
    isLoading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.name = '';
      state.email = '';
      state.uid = '';
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load User Data
      .addCase(loadUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.name = action.payload.name;
          state.email = action.payload.email;
          state.uid = action.payload.uid;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      })
      // Update User Name
      .addCase(updateUserName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload;
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;