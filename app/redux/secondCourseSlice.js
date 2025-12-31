// store/secondCourseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Actions للـ SecondCourse
export const selectCourse = createAsyncThunk(
  'secondCourse/selectCourse',
  async (courseId, { getState }) => {
    const state = getState();
    const course = state.home.topCourses.find(c => c.id === courseId);
    return course || null;
  }
);

const secondCourseSlice = createSlice({
  name: 'secondCourse',
  initialState: {
    selectedCourse: null,
    isCourseSelected: false,
    courseList: [],
    filter: 'all', // يمكن إضافة تصفية إذا لزم الأمر
  },
  reducers: {
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
      state.isCourseSelected = !!action.payload;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
      state.isCourseSelected = false;
    },
    filterCourses: (state, action) => {
      state.filter = action.payload;
    },
    setCourseList: (state, action) => {
      state.courseList = action.payload;
    },
    updateCourseProgress: (state, action) => {
      const { courseId, progress } = action.payload;
      if (state.selectedCourse && state.selectedCourse.id === courseId) {
        state.selectedCourse.progress = progress;
      }
      const index = state.courseList.findIndex(c => c.id === courseId);
      if (index !== -1) {
        state.courseList[index].progress = progress;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectCourse.fulfilled, (state, action) => {
        state.selectedCourse = action.payload;
        state.isCourseSelected = !!action.payload;
      });
  },
});

export const { 
  setSelectedCourse, 
  clearSelectedCourse, 
  filterCourses,
  setCourseList,
  updateCourseProgress 
} = secondCourseSlice.actions;

export default secondCourseSlice.reducer;