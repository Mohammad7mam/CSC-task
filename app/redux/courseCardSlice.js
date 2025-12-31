// store/courseCardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const courseCardSlice = createSlice({
  name: 'courseCard',
  initialState: {
    expandedCardId: null,
    cardPressCount: {},
    recentlyViewed: [],
    favorites: [],
    viewedDetails: [],
  },
  reducers: {
    expandCard: (state, action) => {
      state.expandedCardId = action.payload;
    },
    collapseCard: (state) => {
      state.expandedCardId = null;
    },
    incrementCardPress: (state, action) => {
      const courseId = action.payload;
      state.cardPressCount[courseId] = (state.cardPressCount[courseId] || 0) + 1;
    },
    addToRecentlyViewed: (state, action) => {
      const course = action.payload;
      // إزالة إذا موجود مسبقاً
      state.recentlyViewed = state.recentlyViewed.filter(c => c.id !== course.id);
      // إضافة في البداية
      state.recentlyViewed.unshift(course);
      // حفظ فقط آخر 10
      if (state.recentlyViewed.length > 10) {
        state.recentlyViewed.pop();
      }
    },
    toggleFavorite: (state, action) => {
      const courseId = action.payload;
      const index = state.favorites.indexOf(courseId);
      if (index === -1) {
        state.favorites.push(courseId);
      } else {
        state.favorites.splice(index, 1);
      }
    },
    markAsViewed: (state, action) => {
      const courseId = action.payload;
      if (!state.viewedDetails.includes(courseId)) {
        state.viewedDetails.push(courseId);
      }
    },
    clearCardState: (state) => {
      state.expandedCardId = null;
      state.cardPressCount = {};
    },
  },
});

export const { 
  expandCard, 
  collapseCard, 
  incrementCardPress,
  addToRecentlyViewed,
  toggleFavorite,
  markAsViewed,
  clearCardState 
} = courseCardSlice.actions;

export default courseCardSlice.reducer;