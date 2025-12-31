// store/lessonCardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const lessonCardSlice = createSlice({
  name: 'lessonCard',
  initialState: {
    iconPreferences: {}, // { [category]: { color, size } }
    cardStyles: {}, // { [progressId]: { backgroundColor, textColor } }
    collapsedCards: [],
    autoPlaySettings: {
      enabled: false,
      speed: 1.0,
    },
    displaySettings: {
      showIcons: true,
      showProgress: true,
      compactMode: false,
    },
  },
  reducers: {
    setIconColor: (state, action) => {
      const { category, color } = action.payload;
      if (!state.iconPreferences[category]) {
        state.iconPreferences[category] = {};
      }
      state.iconPreferences[category].color = color;
    },
    setIconSize: (state, action) => {
      const { category, size } = action.payload;
      if (!state.iconPreferences[category]) {
        state.iconPreferences[category] = {};
      }
      state.iconPreferences[category].size = size;
    },
    setCardStyle: (state, action) => {
      const { progressId, style } = action.payload;
      state.cardStyles[progressId] = { ...state.cardStyles[progressId], ...style };
    },
    toggleCardCollapse: (state, action) => {
      const progressId = action.payload;
      const index = state.collapsedCards.indexOf(progressId);
      if (index === -1) {
        state.collapsedCards.push(progressId);
      } else {
        state.collapsedCards.splice(index, 1);
      }
    },
    setAutoPlaySettings: (state, action) => {
      state.autoPlaySettings = { ...state.autoPlaySettings, ...action.payload };
    },
    setDisplaySettings: (state, action) => {
      state.displaySettings = { ...state.displaySettings, ...action.payload };
    },
    resetIconPreferences: (state) => {
      state.iconPreferences = {};
    },
  },
});

export const { 
  setIconColor,
  setIconSize,
  setCardStyle,
  toggleCardCollapse,
  setAutoPlaySettings,
  setDisplaySettings,
  resetIconPreferences 
} = lessonCardSlice.actions;

export default lessonCardSlice.reducer;