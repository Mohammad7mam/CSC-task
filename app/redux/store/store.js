// store/store.js
import {configureStore} from '@reduxjs/toolkit';
import courseReducer from '../courseSlice';
import userReducer from '../userSlice';
import courseCardReducer from '../courseCardSlice';
import courseTxtReducer from '../courseTxtSlice';
import homeReducer from '../homeSlice';
import secondCourseReducer from '../secondCourseSlice';
import progressReducer from '../progressSlice';
import yourProgressReducer from '../yourProgressSlice';
import yourProgressSingleReducer from '../yourProgressSingleSlice';
import lessonCardReducer from '../lessonCardSlice';
import adminEnrollmentsReducer from '../adminEnrollmentsSlice';
import authReducer from '../authSlice';
import detailReducer from '../detailSlice';
import detailCombinedReducer from '../detailCombinedSlice';
import detailHeaderReducer from '../detailHeaderSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    user: userReducer,
    courseCard: courseCardReducer,
    courseTxt: courseTxtReducer,
    home: homeReducer,
    secondCourse: secondCourseReducer,
    progress: progressReducer,
    yourProgress: yourProgressReducer,
    yourProgressSingle: yourProgressSingleReducer,
    lessonCard: lessonCardReducer,
    adminEnrollments: adminEnrollmentsReducer,
    auth: authReducer,
    detail: detailReducer,
    detailCombined: detailCombinedReducer,
    detailHeader: detailHeaderReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
