// store/yourProgressSlice.js
import { createSlice } from '@reduxjs/toolkit';

const yourProgressSlice = createSlice({
  name: 'yourProgress',
  initialState: {
    scrollPosition: 0,
    selectedProgressId: null,
    expandedCards: [],
    filter: 'all', // all, in-progress, completed
    viewMode: 'horizontal', // horizontal, grid
    sortBy: 'progress', // progress, title, date
  },
  reducers: {
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
    selectProgress: (state, action) => {
      state.selectedProgressId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedProgressId = null;
    },
    toggleExpandCard: (state, action) => {
      const progressId = action.payload;
      const index = state.expandedCards.indexOf(progressId);
      if (index === -1) {
        state.expandedCards.push(progressId);
      } else {
        state.expandedCards.splice(index, 1);
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    expandAllCards: (state) => {
      // This would require access to all progress IDs
      // Implemented in selector
    },
    collapseAllCards: (state) => {
      state.expandedCards = [];
    },
  },
});

export const { 
  setScrollPosition,
  selectProgress,
  clearSelection,
  toggleExpandCard,
  setFilter,
  setViewMode,
  setSortBy,
  expandAllCards,
  collapseAllCards 
} = yourProgressSlice.actions;

export default yourProgressSlice.reducer;