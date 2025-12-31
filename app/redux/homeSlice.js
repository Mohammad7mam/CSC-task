// store/homeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../firebase/firebase';

// Async Thunks للـ HomeScreen
export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async () => {
    try {
      // جلب Top Courses
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

      // جلب Primary Categories
      const primaryCategoriesRef = database().ref('categories/primary_categories');
      const primarySnapshot = await primaryCategoriesRef.once('value');
      const primaryData = primarySnapshot.val();
      
      let primaryCategories = [];
      if (primaryData) {
        primaryCategories = Object.keys(primaryData).map(key => ({
          ...primaryData[key],
          categoryId: key
        }));
      }

      return {
        topCourses: filteredCourses,
        categoryName,
        primaryCategories
      };
    } catch (error) {
      throw error;
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    topCourses: [],
    categoryName: '',
    primaryCategories: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    setTopCourses: (state, action) => {
      state.topCourses = action.payload;
    },
    setCategoryName: (state, action) => {
      state.categoryName = action.payload;
    },
    setPrimaryCategories: (state, action) => {
      state.primaryCategories = action.payload;
    },
    clearHomeData: (state) => {
      state.topCourses = [];
      state.categoryName = '';
      state.primaryCategories = [];
    },
    updateCourse: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.topCourses.findIndex(course => course.id === id);
      if (index !== -1) {
        state.topCourses[index] = { ...state.topCourses[index], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topCourses = action.payload.topCourses;
        state.categoryName = action.payload.categoryName;
        state.primaryCategories = action.payload.primaryCategories;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { 
  setTopCourses, 
  setCategoryName, 
  setPrimaryCategories, 
  clearHomeData,
  updateCourse 
} = homeSlice.actions;

export default homeSlice.reducer;