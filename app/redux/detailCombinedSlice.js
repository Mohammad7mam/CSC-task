// store/detailCombinedSlice.js
import { createSlice } from '@reduxjs/toolkit';

const detailCombinedSlice = createSlice({
  name: 'detailCombined',
  initialState: {
    backgroundImage: null,
    imageLoading: false,
    imageError: null,
    headerOpacity: 1,
    scrollPosition: 0,
    isBackgroundLoaded: false,
    imageCache: {}, // كاش للصور
    parallaxOffset: 0,
    animationConfig: {
      fadeInDuration: 300,
      parallaxIntensity: 0.5,
      headerHeight: 70,
      bottomOffset: 130,
    },
  },
  reducers: {
    setBackgroundImage: (state, action) => {
      state.backgroundImage = action.payload;
    },
    setImageLoading: (state, action) => {
      state.imageLoading = action.payload;
    },
    setImageError: (state, action) => {
      state.imageError = action.payload;
    },
    setHeaderOpacity: (state, action) => {
      state.headerOpacity = Math.max(0, Math.min(1, action.payload));
    },
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
      
      // تحديث تأثير parallax بناءً على موقع التمرير
      state.parallaxOffset = action.payload * state.animationConfig.parallaxIntensity;
      
      // تحديث شفافية الهيدر بناءً على التمرير
      const scrollThreshold = 100;
      state.headerOpacity = Math.max(0.5, 1 - (action.payload / scrollThreshold));
    },
    setBackgroundLoaded: (state, action) => {
      state.isBackgroundLoaded = action.payload;
    },
    cacheImage: (state, action) => {
      const { url, imageData } = action.payload;
      state.imageCache[url] = {
        data: imageData,
        timestamp: Date.now(),
      };
    },
    clearImageCache: (state) => {
      state.imageCache = {};
    },
    removeExpiredCache: (state) => {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      Object.keys(state.imageCache).forEach(key => {
        if (now - state.imageCache[key].timestamp > oneDay) {
          delete state.imageCache[key];
        }
      });
    },
    updateAnimationConfig: (state, action) => {
      state.animationConfig = { ...state.animationConfig, ...action.payload };
    },
    resetCombinedState: (state) => {
      state.backgroundImage = null;
      state.imageLoading = false;
      state.imageError = null;
      state.headerOpacity = 1;
      state.scrollPosition = 0;
      state.isBackgroundLoaded = false;
      state.parallaxOffset = 0;
    },
  },
});

export const {
  setBackgroundImage,
  setImageLoading,
  setImageError,
  setHeaderOpacity,
  setScrollPosition,
  setBackgroundLoaded,
  cacheImage,
  clearImageCache,
  removeExpiredCache,
  updateAnimationConfig,
  resetCombinedState,
} = detailCombinedSlice.actions;

export default detailCombinedSlice.reducer;