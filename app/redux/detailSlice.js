// store/detailSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunks
export const fetchCourseDetails = createAsyncThunk(
  'detail/fetchCourseDetails',
  async (courseId, { rejectWithValue }) => {
    try {
      if (!courseId) {
        throw new Error('No course ID provided');
      }

      const response = await fetch(
        `https://tst-csc-default-rtdb.firebaseio.com/courses/${courseId}.json`,
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }
      
      const data = await response.json();
      
      if (!data) {
        throw new Error('Course not found');
      }
      
      return { ...data, id: courseId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRelatedCourses = createAsyncThunk(
  'detail/fetchRelatedCourses',
  async (primaryCategory, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://tst-csc-default-rtdb.firebaseio.com/courses.json',
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      const coursesArray = data 
        ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
        : [];
      
      const relatedCourses = coursesArray.filter(course => 
        course.categories?.primary === primaryCategory
      ).slice(0, 5);
      
      return relatedCourses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCourseViewCount = createAsyncThunk(
  'detail/updateCourseViewCount',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://tst-csc-default-rtdb.firebaseio.com/courses/${courseId}/viewCount.json`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Date.now()),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update view count');
      }
      
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const detailSlice = createSlice({
  name: 'detail',
  initialState: {
    course: null,
    loading: true,
    error: null,
    relatedCourses: [],
    viewCount: 0,
    lastViewedCourses: [],
    currentCourseId: null,
    isEnrolled: false,
    enrollmentLoading: false,
    enrollmentError: null,
  },
  reducers: {
    setCourse: (state, action) => {
      state.course = action.payload;
      state.loading = false;
      state.error = null;
      if (action.payload?.id) {
        state.currentCourseId = action.payload.id;
        // إضافة إلى آخر الكورسات المشاهدة
        const existingIndex = state.lastViewedCourses.findIndex(
          c => c.id === action.payload.id
        );
        if (existingIndex !== -1) {
          state.lastViewedCourses.splice(existingIndex, 1);
        }
        state.lastViewedCourses.unshift(action.payload);
        // حفظ فقط آخر 10 كورسات
        if (state.lastViewedCourses.length > 10) {
          state.lastViewedCourses.pop();
        }
      }
    },
    setCourseFromParams: (state, action) => {
      const { course } = action.payload;
      if (course) {
        state.course = course;
        state.loading = false;
        state.error = null;
        if (course.id) {
          state.currentCourseId = course.id;
          // إضافة إلى آخر الكورسات المشاهدة
          const existingIndex = state.lastViewedCourses.findIndex(
            c => c.id === course.id
          );
          if (existingIndex !== -1) {
            state.lastViewedCourses.splice(existingIndex, 1);
          }
          state.lastViewedCourses.unshift(course);
          if (state.lastViewedCourses.length > 10) {
            state.lastViewedCourses.pop();
          }
        }
      }
    },
    clearCourse: (state) => {
      state.course = null;
      state.loading = false;
      state.error = null;
      state.currentCourseId = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCourseData: (state, action) => {
      if (state.course) {
        state.course = { ...state.course, ...action.payload };
      }
    },
    setEnrollmentStatus: (state, action) => {
      state.isEnrolled = action.payload;
    },
    setEnrollmentLoading: (state, action) => {
      state.enrollmentLoading = action.payload;
    },
    setEnrollmentError: (state, action) => {
      state.enrollmentError = action.payload;
    },
    incrementViewCount: (state) => {
      state.viewCount += 1;
    },
    addToRecentlyViewed: (state, action) => {
      const existingIndex = state.lastViewedCourses.findIndex(
        c => c.id === action.payload.id
      );
      if (existingIndex !== -1) {
        state.lastViewedCourses.splice(existingIndex, 1);
      }
      state.lastViewedCourses.unshift(action.payload);
      if (state.lastViewedCourses.length > 10) {
        state.lastViewedCourses.pop();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
        state.currentCourseId = action.payload.id;
        state.error = null;
        state.viewCount += 1;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.course = null;
      })
      .addCase(fetchRelatedCourses.fulfilled, (state, action) => {
        state.relatedCourses = action.payload;
      })
      .addCase(updateCourseViewCount.fulfilled, (state) => {
        // تم تحديث عدد المشاهدات
      });
  },
});

export const {
  setCourse,
  setCourseFromParams,
  clearCourse,
  setLoading,
  setError,
  clearError,
  updateCourseData,
  setEnrollmentStatus,
  setEnrollmentLoading,
  setEnrollmentError,
  incrementViewCount,
  addToRecentlyViewed,
} = detailSlice.actions;

export default detailSlice.reducer;