// store/courseTxtSlice.js
import { createSlice } from '@reduxjs/toolkit';

const courseTxtSlice = createSlice({
  name: 'courseTxt',
  initialState: {
    instructorImages: {}, // تخزين مؤقت للصور
    courseStats: {}, // إحصائيات الكورسات
    textFormat: {
      fontSize: 'default',
      language: 'en',
    },
    collapsedCourses: [],
  },
  reducers: {
    cacheInstructorImage: (state, action) => {
      const { instructorId, imageUri } = action.payload;
      state.instructorImages[instructorId] = imageUri;
    },
    updateCourseStats: (state, action) => {
      const { courseId, stats } = action.payload;
      state.courseStats[courseId] = {
        ...state.courseStats[courseId],
        ...stats,
      };
    },
    incrementViewCount: (state, action) => {
      const courseId = action.payload;
      if (!state.courseStats[courseId]) {
        state.courseStats[courseId] = { viewCount: 0 };
      }
      state.courseStats[courseId].viewCount++;
    },
    setTextFormat: (state, action) => {
      state.textFormat = { ...state.textFormat, ...action.payload };
    },
    toggleCourseCollapse: (state, action) => {
      const courseId = action.payload;
      const index = state.collapsedCourses.indexOf(courseId);
      if (index === -1) {
        state.collapsedCourses.push(courseId);
      } else {
        state.collapsedCourses.splice(index, 1);
      }
    },
    clearImageCache: (state) => {
      state.instructorImages = {};
    },
  },
});

export const { 
  cacheInstructorImage, 
  updateCourseStats,
  incrementViewCount,
  setTextFormat,
  toggleCourseCollapse,
  clearImageCache 
} = courseTxtSlice.actions;

export default courseTxtSlice.reducer;