// store/detailHeaderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const detailHeaderSlice = createSlice({
  name: 'detailHeader',
  initialState: {
    title: '',
    instructorName: '',
    isTitleExpanded: false,
    textFormat: {
      fontSize: 24,
      lineHeight: 32,
      numberOfLines: 2,
    },
    displaySettings: {
      showInstructor: true,
      showShortDescription: true,
      compactMode: false,
    },
    interactionStats: {
      titleClicks: 0,
      instructorClicks: 0,
      lastInteraction: null,
    },
    animationState: {
      fadeInComplete: false,
      slideInComplete: false,
    },
  },
  reducers: {
    setHeaderData: (state, action) => {
      const { title, instructorName } = action.payload;
      state.title = title || 'Course description not available';
      state.instructorName = instructorName || 'Unknown Instructor';
    },
    toggleTitleExpanded: (state) => {
      state.isTitleExpanded = !state.isTitleExpanded;
      state.textFormat.numberOfLines = state.isTitleExpanded ? 0 : 2;
    },
    setTextFormat: (state, action) => {
      state.textFormat = { ...state.textFormat, ...action.payload };
    },
    setDisplaySettings: (state, action) => {
      state.displaySettings = { ...state.displaySettings, ...action.payload };
    },
    incrementTitleClicks: (state) => {
      state.interactionStats.titleClicks += 1;
      state.interactionStats.lastInteraction = Date.now();
    },
    incrementInstructorClicks: (state) => {
      state.interactionStats.instructorClicks += 1;
      state.interactionStats.lastInteraction = Date.now();
    },
    setAnimationState: (state, action) => {
      state.animationState = { ...state.animationState, ...action.payload };
    },
    resetHeaderState: (state) => {
      state.title = '';
      state.instructorName = '';
      state.isTitleExpanded = false;
      state.textFormat = {
        fontSize: 24,
        lineHeight: 32,
        numberOfLines: 2,
      };
      state.interactionStats = {
        titleClicks: 0,
        instructorClicks: 0,
        lastInteraction: null,
      };
      state.animationState = {
        fadeInComplete: false,
        slideInComplete: false,
      };
    },
    updateHeaderFromCourse: (state, action) => {
      const course = action.payload;
      if (course) {
        state.title = course.shortDescription || 'Course description not available';
        state.instructorName = course.instructor?.name || 'Unknown Instructor';
      }
    },
  },
});

export const {
  setHeaderData,
  toggleTitleExpanded,
  setTextFormat,
  setDisplaySettings,
  incrementTitleClicks,
  incrementInstructorClicks,
  setAnimationState,
  resetHeaderState,
  updateHeaderFromCourse,
} = detailHeaderSlice.actions;

export default detailHeaderSlice.reducer;