// store/adminEnrollmentsSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// Basic Selectors
export const selectAdminEnrollmentsState = (state) => state.adminEnrollments;
export const selectEnrollments = (state) => state.adminEnrollments.enrollments;
export const selectCurrentUser = (state) => state.adminEnrollments.currentUser;
export const selectIsAdmin = (state) => state.adminEnrollments.isAdmin;
export const selectLoading = (state) => state.adminEnrollments.loading;
export const selectRefreshing = (state) => state.adminEnrollments.refreshing;
export const selectActionLoading = (state) => state.adminEnrollments.actionLoading;
export const selectError = (state) => state.adminEnrollments.error;
export const selectStatistics = (state) => state.adminEnrollments.statistics;
export const selectFilters = (state) => state.adminEnrollments.filters;

// Memoized Selectors for Performance
export const selectFilteredEnrollments = createSelector(
  [selectEnrollments, selectFilters],
  (enrollments, filters) => {
    let filtered = [...enrollments];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.courseTitle?.toLowerCase().includes(query) ||
        e.userName?.toLowerCase().includes(query) ||
        e.userEmail?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
        break;
      case 'user':
        filtered.sort((a, b) => (a.userName || '').localeCompare(b.userName || ''));
        break;
      case 'course':
        filtered.sort((a, b) => (a.courseTitle || '').localeCompare(b.courseTitle || ''));
        break;
      default:
        filtered.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
    }

    return filtered;
  }
);

export const selectPendingEnrollments = createSelector(
  [selectEnrollments],
  (enrollments) => enrollments.filter(e => e.status === 'pending')
);

export const selectEnrollmentById = (enrollmentId) => createSelector(
  [selectEnrollments],
  (enrollments) => enrollments.find(e => e.id === enrollmentId)
);

export const selectEnrollmentsByCourse = (courseId) => createSelector(
  [selectEnrollments],
  (enrollments) => enrollments.filter(e => e.courseId === courseId)
);

export const selectEnrollmentsByUser = (userId) => createSelector(
  [selectEnrollments],
  (enrollments) => enrollments.filter(e => e.userId === userId)
);

export const selectFormattedStatistics = createSelector(
  [selectStatistics],
  (statistics) => ({
    ...statistics,
    pendingPercentage: statistics.total > 0 
      ? Math.round((statistics.pending / statistics.total) * 100) 
      : 0,
    approvedPercentage: statistics.total > 0 
      ? Math.round((statistics.approved / statistics.total) * 100) 
      : 0,
    rejectedPercentage: statistics.total > 0 
      ? Math.round((statistics.rejected / statistics.total) * 100) 
      : 0,
    formatted: {
      total: `${statistics.total} requests`,
      pending: `${statistics.pending} pending`,
      approved: `${statistics.approved} approved`,
      rejected: `${statistics.rejected} rejected`,
    }
  })
);

export const selectEnrollmentCountByMonth = createSelector(
  [selectEnrollments],
  (enrollments) => {
    const monthlyCount = {};
    
    enrollments.forEach(enrollment => {
      if (enrollment.requestDate) {
        const date = new Date(enrollment.requestDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyCount[monthYear]) {
          monthlyCount[monthYear] = {
            month: date.toLocaleString('default', { month: 'long' }),
            year: date.getFullYear(),
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          };
        }
        
        monthlyCount[monthYear].total++;
        monthlyCount[monthYear][enrollment.status]++;
      }
    });
    
    return Object.values(monthlyCount).sort((a, b) => 
      new Date(`${b.year}-${String(b.month).padStart(2, '0')}`) - 
      new Date(`${a.year}-${String(a.month).padStart(2, '0')}`)
    );
  }
);

export const selectTopCourses = createSelector(
  [selectEnrollments],
  (enrollments) => {
    const courseCount = {};
    
    enrollments.forEach(enrollment => {
      if (enrollment.courseTitle) {
        if (!courseCount[enrollment.courseTitle]) {
          courseCount[enrollment.courseTitle] = {
            title: enrollment.courseTitle,
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          };
        }
        
        courseCount[enrollment.courseTitle].total++;
        courseCount[enrollment.courseTitle][enrollment.status]++;
      }
    });
    
    return Object.values(courseCount)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 courses
  }
);

export const selectEnrollmentsSummary = createSelector(
  [selectFilteredEnrollments, selectFormattedStatistics, selectEnrollmentCountByMonth, selectTopCourses],
  (filteredEnrollments, statistics, monthlyData, topCourses) => ({
    filteredCount: filteredEnrollments.length,
    statistics,
    monthlyData,
    topCourses,
    averageProcessingTime: calculateAverageProcessingTime(filteredEnrollments),
    recentActivity: getRecentActivity(filteredEnrollments),
  })
);

// Helper functions
const calculateAverageProcessingTime = (enrollments) => {
  const processed = enrollments.filter(e => 
    e.status === 'approved' || e.status === 'rejected'
  );
  
  if (processed.length === 0) return 0;
  
  const totalTime = processed.reduce((sum, enrollment) => {
    if (enrollment.requestDate && enrollment.processedDate) {
      const requestDate = new Date(enrollment.requestDate);
      const processedDate = new Date(enrollment.processedDate);
      const diffHours = (processedDate - requestDate) / (1000 * 60 * 60);
      return sum + diffHours;
    }
    return sum;
  }, 0);
  
  return Math.round(totalTime / processed.length);
};

const getRecentActivity = (enrollments) => {
  const recent = [...enrollments]
    .filter(e => e.processedDate)
    .sort((a, b) => new Date(b.processedDate) - new Date(a.processedDate))
    .slice(0, 5);
  
  return recent.map(e => ({
    id: e.id,
    course: e.courseTitle,
    user: e.userName,
    status: e.status,
    date: e.processedDate,
    action: e.status === 'approved' ? 'Approved' : 'Rejected',
  }));
};