// store/progressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../firebase/firebase';

// Async Thunks
export const fetchRecommendedCourses = createAsyncThunk(
  'progress/fetchRecommendedCourses',
  async () => {
    try {
      const categoriesRef = database().ref('categories/secondary_categories');
      const categoriesSnapshot = await categoriesRef.once('value');
      const categoriesData = categoriesSnapshot.val();

      const coursesRef = database().ref('courses');
      const coursesSnapshot = await coursesRef.once('value');
      const coursesData = coursesSnapshot.val();

      let recommendedCategoryName = '';
      const filteredCourses = [];

      if (categoriesData && categoriesData.recommended) {
        recommendedCategoryName = categoriesData.recommended.name;
      }

      if (coursesData) {
        Object.keys(coursesData).forEach(courseId => {
          const course = coursesData[courseId];

          if (
            course.categories &&
            course.categories.secondary &&
            Array.isArray(course.categories.secondary)
          ) {
            const hasRecommended = course.categories.secondary.includes('Recommended Courses');

            if (hasRecommended) {
              filteredCourses.push({
                id: courseId,
                ...course,
              });
            }
          }
        });
      }

      return {
        recommendedCourses: filteredCourses,
        recommendedCategoryName,
      };
    } catch (error) {
      throw error;
    }
  }
);

export const fetchUserProgress = createAsyncThunk(
  'progress/fetchUserProgress',
  async () => {
    try {
      const userJson = await AsyncStorage.getItem('current_user');
      
      if (!userJson) {
        throw new Error('No user data found');
      }

      const loggedInUser = JSON.parse(userJson);
      const loggedInUserId = loggedInUser.uid || loggedInUser.id;

      const response = await fetch(
        'https://tst-csc-default-rtdb.firebaseio.com/user_progress/.json'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }

      const progressJson = await response.json();
      const progressArray = Object.values(progressJson || {});
      const userProgress = progressArray.filter(
        progress => progress.userId === loggedInUserId
      );

      return {
        user: loggedInUser,
        progress: userProgress,
      };
    } catch (error) {
      throw error;
    }
  }
);

export const retryProgressData = createAsyncThunk(
  'progress/retryProgressData',
  async (_, { dispatch }) => {
    await dispatch(fetchUserProgress());
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    recommendedCourses: [],
    recommendedCategoryName: '',
    userProgress: [],
    currentUser: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearProgressData: (state) => {
      state.recommendedCourses = [];
      state.userProgress = [];
      state.currentUser = null;
      state.error = null;
    },
    updateCourseProgress: (state, action) => {
      const { progressId, percentage } = action.payload;
      const index = state.userProgress.findIndex(p => p.progressId === progressId);
      if (index !== -1) {
        state.userProgress[index].overallProgress = percentage;
      }
    },
    setProgressError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Recommended Courses
      .addCase(fetchRecommendedCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedCourses.fulfilled, (state, action) => {
        state.recommendedCourses = action.payload.recommendedCourses;
        state.recommendedCategoryName = action.payload.recommendedCategoryName;
        state.isLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRecommendedCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // User Progress
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.userProgress = action.payload.progress;
        state.currentUser = action.payload.user;
        state.isLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.currentUser = null;
        state.userProgress = [];
      })
      // Retry
      .addCase(retryProgressData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  },
});

export const { 
  clearProgressData, 
  updateCourseProgress, 
  setProgressError 
} = progressSlice.actions;

export default progressSlice.reducer;