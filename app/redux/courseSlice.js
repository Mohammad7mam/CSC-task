// store/courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../firebase/firebase';

// Async Thunks
export const fetchTopCourses = createAsyncThunk(
  'courses/fetchTopCourses',
  async () => {
    try {
      const categoriesRef = database().ref('categories/secondary_categories');
      const categoriesSnapshot = await categoriesRef.once('value');
      const categoriesData = categoriesSnapshot.val();

      const coursesRef = database().ref('courses');
      const coursesSnapshot = await coursesRef.once('value');
      const coursesData = coursesSnapshot.val();

      let categoryName = '';
      const filteredCourses = [];

      if (categoriesData && categoriesData.top_courses) {
        categoryName = categoriesData.top_courses.name;
      }

      if (coursesData) {
        Object.keys(coursesData).forEach(courseId => {
          const course = coursesData[courseId];
          
          if (course.categories && 
              course.categories.secondary && 
              Array.isArray(course.categories.secondary)) {
            
            const hasTopCourses = course.categories.secondary.includes('Top Courses for you');
            
            if (hasTopCourses) {
              filteredCourses.push({
                id: courseId,
                ...course
              });
            }
          }
        });
      }

      return { courses: filteredCourses, categoryName };
    } catch (error) {
      throw error;
    }
  }
);

export const fetchPrimaryCategories = createAsyncThunk(
  'courses/fetchPrimaryCategories',
  async () => {
    try {
      const categoriesRef = database().ref('categories/primary_categories');
      const snapshot = await categoriesRef.once('value');
      const data = snapshot.val();
      
      if (data) {
        return Object.keys(data).map(key => ({
          ...data[key],
          categoryId: key
        }));
      }
      return [];
    } catch (error) {
      throw error;
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    topCourses: [],
    categoryName: '',
    primaryCategories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCourses: (state) => {
      state.topCourses = [];
      state.categoryName = '';
    },
    clearCategories: (state) => {
      state.primaryCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Top Courses
      .addCase(fetchTopCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.topCourses = action.payload.courses;
        state.categoryName = action.payload.categoryName;
      })
      .addCase(fetchTopCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Primary Categories
      .addCase(fetchPrimaryCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrimaryCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.primaryCategories = action.payload;
      })
      .addCase(fetchPrimaryCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCourses, clearCategories } = courseSlice.actions;
export default courseSlice.reducer;