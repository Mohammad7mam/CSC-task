// store/yourProgressSingleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const yourProgressSingleSlice = createSlice({
  name: 'yourProgressSingle',
  initialState: {
    lessonStats: {}, // { [progressId]: { viewTime, completionRate, lastViewed } }
    cardInteractions: {}, // { [progressId]: { clickCount, lastClicked } }
    performanceData: {}, // { [progressId]: { quizScores, assignmentGrades } }
  },
  reducers: {
    updateLessonStats: (state, action) => {
      const { progressId, stats } = action.payload;
      state.lessonStats[progressId] = {
        ...state.lessonStats[progressId],
        ...stats,
      };
    },
    incrementClickCount: (state, action) => {
      const progressId = action.payload;
      if (!state.cardInteractions[progressId]) {
        state.cardInteractions[progressId] = { clickCount: 0, lastClicked: null };
      }
      state.cardInteractions[progressId].clickCount++;
      state.cardInteractions[progressId].lastClicked = new Date().toISOString();
    },
    updatePerformanceData: (state, action) => {
      const { progressId, performance } = action.payload;
      state.performanceData[progressId] = {
        ...state.performanceData[progressId],
        ...performance,
      };
    },
    clearCardInteractions: (state) => {
      state.cardInteractions = {};
    },
    resetProgressStats: (state, action) => {
      const progressId = action.payload;
      delete state.lessonStats[progressId];
      delete state.cardInteractions[progressId];
      delete state.performanceData[progressId];
    },
  },
});

export const { 
  updateLessonStats,
  incrementClickCount,
  updatePerformanceData,
  clearCardInteractions,
  resetProgressStats 
} = yourProgressSingleSlice.actions;

export default yourProgressSingleSlice.reducer;