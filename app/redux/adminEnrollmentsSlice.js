// store/adminEnrollmentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressService from '../services/ProgressService';

// Async Thunks
export const checkAdminStatus = createAsyncThunk(
  'adminEnrollments/checkAdminStatus',
  async (_, { rejectWithValue }) => {
    try {
      const userJson = await AsyncStorage.getItem('current_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        return {
          user,
          isAdmin: user.userType === 'admin'
        };
      }
      return { user: null, isAdmin: false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEnrollments = createAsyncThunk(
  'adminEnrollments/fetchEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://tst-csc-default-rtdb.firebaseio.com/course_enrollments.json',
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      // Convert from object to array with keys
      const enrollmentsArray = data
        ? Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }))
        : [];

      // Sort by date (newest first)
      enrollmentsArray.sort(
        (a, b) => new Date(b.requestDate) - new Date(a.requestDate),
      );

      return enrollmentsArray;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEnrollmentStatus = createAsyncThunk(
  'adminEnrollments/updateEnrollmentStatus',
  async ({ enrollmentId, newStatus, enrollment }, { rejectWithValue, getState, dispatch }) => {
    try {
      // 1. Use ProgressService to update status and create progress if needed
      const result = await ProgressService.updateEnrollmentStatus(
        enrollmentId,
        newStatus,
        enrollment,
      );

      if (result.success) {
        // 2. Update Firebase with progress ID if approved
        if (newStatus === 'approved' && result.progressId) {
          try {
            const progressLinkUrl = `https://tst-csc-default-rtdb.firebaseio.com/course_enrollments/${enrollmentId}/progressId.json`;
            await fetch(progressLinkUrl, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(result.progressId),
            });
          } catch (linkError) {
            console.warn('⚠️ Failed to link progress to enrollment:', linkError);
          }
        }

        // 3. Send notification to user
        dispatch(sendNotification({
          enrollmentId,
          newStatus,
          progressId: result.progressId,
          enrollment
        }));

        // 4. Log admin activity
        const { currentUser } = getState().adminEnrollments;
        dispatch(logAdminActivity({
          enrollmentId,
          previousStatus: enrollment.status,
          newStatus,
          progressId: result.progressId,
          admin: currentUser?.fullName || currentUser?.email,
        }));

        return {
          enrollmentId,
          newStatus,
          progressId: result.progressId,
          success: true
        };
      } else {
        return rejectWithValue('Failed to update enrollment status');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendNotification = createAsyncThunk(
  'adminEnrollments/sendNotification',
  async ({ enrollmentId, newStatus, progressId, enrollment }, { rejectWithValue }) => {
    try {
      const statusText = newStatus === 'approved' ? 'Approved' : 'Rejected';

      const notificationData = {
        userId: enrollment.userId,
        userEmail: enrollment.userEmail,
        userName: enrollment.userName,
        courseTitle: enrollment.courseTitle,
        status: newStatus,
        statusText: statusText,
        enrollmentId: enrollmentId,
        progressId: progressId,
        notificationType: newStatus === 'approved' ? 'approval' : 'rejection',
        timestamp: new Date().toISOString(),
        message:
          newStatus === 'approved'
            ? `Congratulations! Your enrollment request for "${enrollment.courseTitle}" has been approved. You can now start learning.`
            : `Sorry, your enrollment request for "${enrollment.courseTitle}" has been rejected.`,
      };

      // Save notification to Firebase
      if (progressId) {
        const notificationId = `notification_${Date.now()}`;
        const notificationUrl = `https://tst-csc-default-rtdb.firebaseio.com/user_notifications/${enrollment.userId}/${notificationId}.json`;

        await fetch(notificationUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notificationData),
        });
      }

      return notificationData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logAdminActivity = createAsyncThunk(
  'adminEnrollments/logAdminActivity',
  async (activityData, { rejectWithValue }) => {
    try {
      const activityId = `activity_${Date.now()}`;
      const activityUrl = `https://tst-csc-default-rtdb.firebaseio.com/admin_activities/${activityId}.json`;

      const completeActivityData = {
        ...activityData,
        timestamp: new Date().toISOString(),
      };

      await fetch(activityUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeActivityData),
      });

      return completeActivityData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminEnrollmentsSlice = createSlice({
  name: 'adminEnrollments',
  initialState: {
    enrollments: [],
    currentUser: null,
    isAdmin: false,
    loading: false,
    refreshing: false,
    actionLoading: false,
    error: null,
    statistics: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    filters: {
      status: 'all', // all, pending, approved, rejected
      sortBy: 'date', // date, user, course
      searchQuery: '',
    },
    notifications: [],
    activities: [],
  },
  reducers: {
    setRefreshing: (state, action) => {
      state.refreshing = action.payload;
    },
    setActionLoading: (state, action) => {
      state.actionLoading = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAll: (state) => {
      state.enrollments = [];
      state.currentUser = null;
      state.isAdmin = false;
      state.error = null;
    },
    updateLocalEnrollment: (state, action) => {
      const { enrollmentId, updates } = action.payload;
      const index = state.enrollments.findIndex(e => e.id === enrollmentId);
      if (index !== -1) {
        state.enrollments[index] = { ...state.enrollments[index], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Admin Status
      .addCase(checkAdminStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAdminStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.isAdmin = action.payload.isAdmin;
      })
      .addCase(checkAdminStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAdmin = false;
      })
      
      // Fetch Enrollments
      .addCase(fetchEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.enrollments = action.payload;
        
        // Update statistics
        const total = action.payload.length;
        const pending = action.payload.filter(e => e.status === 'pending').length;
        const approved = action.payload.filter(e => e.status === 'approved').length;
        const rejected = action.payload.filter(e => e.status === 'rejected').length;
        
        state.statistics = { total, pending, approved, rejected };
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload;
      })
      
      // Update Enrollment Status
      .addCase(updateEnrollmentStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateEnrollmentStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { enrollmentId, newStatus, progressId } = action.payload;
        
        // Update local enrollment
        const index = state.enrollments.findIndex(e => e.id === enrollmentId);
        if (index !== -1) {
          state.enrollments[index].status = newStatus;
          if (progressId) {
            state.enrollments[index].progressId = progressId;
          }
        }
        
        // Update statistics
        const pending = state.enrollments.filter(e => e.status === 'pending').length;
        const approved = state.enrollments.filter(e => e.status === 'approved').length;
        const rejected = state.enrollments.filter(e => e.status === 'rejected').length;
        
        state.statistics = { 
          ...state.statistics, 
          pending, 
          approved, 
          rejected 
        };
      })
      .addCase(updateEnrollmentStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      
      // Send Notification
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.notifications.push(action.payload);
      })
      
      // Log Admin Activity
      .addCase(logAdminActivity.fulfilled, (state, action) => {
        state.activities.push(action.payload);
      });
  },
});

export const {
  setRefreshing,
  setActionLoading,
  setFilters,
  clearError,
  clearAll,
  updateLocalEnrollment,
} = adminEnrollmentsSlice.actions;

export default adminEnrollmentsSlice.reducer;