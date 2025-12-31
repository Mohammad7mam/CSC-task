// store/progressSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// =========== Selectors الأساسية ===========

// Selectors لـ progressSlice
export const selectProgressState = (state) => state.progress;
export const selectRecommendedCourses = (state) => state.progress?.recommendedCourses || [];
export const selectRecommendedCategoryName = (state) => state.progress?.recommendedCategoryName || '';
export const selectUserProgress = (state) => state.progress?.userProgress || [];
export const selectCurrentUser = (state) => state.progress?.currentUser || null;
export const selectProgressLoading = (state) => state.progress?.isLoading || false;
export const selectProgressError = (state) => state.progress?.error || null;
export const selectLastUpdated = (state) => state.progress?.lastUpdated || null;

// Selectors لـ yourProgressSlice
export const selectYourProgressState = (state) => state.yourProgress || {};
export const selectFilter = (state) => state.yourProgress?.filter || 'all';
export const selectViewMode = (state) => state.yourProgress?.viewMode || 'horizontal';
export const selectSortBy = (state) => state.yourProgress?.sortBy || 'progress';
export const selectExpandedCards = (state) => state.yourProgress?.expandedCards || [];

// Selectors لـ yourProgressSingleSlice
export const selectYourProgressSingleState = (state) => state.yourProgressSingle || {};
export const selectLessonStats = (state) => state.yourProgressSingle?.lessonStats || {};
export const selectCardInteractions = (state) => state.yourProgressSingle?.cardInteractions || {};

// Selectors لـ lessonCardSlice
export const selectLessonCardState = (state) => state.lessonCard || {};
export const selectIconPreferences = (state) => state.lessonCard?.iconPreferences || {};
export const selectDisplaySettings = (state) => state.lessonCard?.displaySettings || {};

// =========== Selectors محسنة ===========

// فلترة وترتيب التقدم
export const selectFilteredProgress = createSelector(
  [selectUserProgress, selectFilter, selectSortBy],
  (progress, filter, sortBy) => {
    let filtered = [...progress];
    
    // التصفية حسب الحالة
    if (filter === 'in-progress') {
      filtered = filtered.filter(p => (p.overallProgress || 0) < 100 && (p.overallProgress || 0) > 0);
    } else if (filter === 'completed') {
      filtered = filtered.filter(p => (p.overallProgress || 0) === 100);
    } else if (filter === 'not-started') {
      filtered = filtered.filter(p => (p.overallProgress || 0) === 0);
    }
    
    // الترتيب
    switch (sortBy) {
      case 'progress':
        filtered.sort((a, b) => (b.overallProgress || 0) - (a.overallProgress || 0));
        break;
      case 'title':
        filtered.sort((a, b) => (a.courseTitle || '').localeCompare(b.courseTitle || ''));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
        break;
      default:
        // الترتيب الافتراضي حسب التاريخ
        filtered.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
    }
    
    return filtered;
  }
);

// إحصائيات التقدم
export const selectProgressStatistics = createSelector(
  [selectUserProgress],
  (progress) => {
    const totalCourses = progress.length;
    const completedCourses = progress.filter(p => (p.overallProgress || 0) === 100).length;
    const inProgressCourses = progress.filter(p => (p.overallProgress || 0) < 100 && (p.overallProgress || 0) > 0).length;
    const notStartedCourses = progress.filter(p => (p.overallProgress || 0) === 0).length;
    const totalLessons = progress.reduce((sum, p) => sum + (p.courseDetails?.totalLessons || 0), 0);
    const completedLessons = progress.reduce((sum, p) => sum + (p.currentLesson || 0), 0);
    
    const averageProgress = totalCourses > 0 
      ? progress.reduce((sum, p) => sum + (p.overallProgress || 0), 0) / totalCourses
      : 0;
    
    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      notStartedCourses,
      totalLessons,
      completedLessons,
      averageProgress: Math.round(averageProgress),
      completionRate: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0,
      lessonCompletionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  }
);

// بيانات التقدم المثراة
export const selectEnrichedProgressData = createSelector(
  [selectFilteredProgress, selectLessonStats, selectCardInteractions, selectIconPreferences],
  (progress, lessonStats, cardInteractions, iconPreferences) => {
    return progress.map(p => {
      const stats = lessonStats[p.progressId] || {};
      const interactions = cardInteractions[p.progressId] || {};
      const iconColor = iconPreferences[p.courseDetails?.categories?.primary]?.color || '#000';
      
      // حساب النسبة المئوية
      let percentage = p.overallProgress || 0;
      if (p.courseDetails?.totalLessons > 0 && p.currentLesson > 0) {
        percentage = Math.round((p.currentLesson / p.courseDetails.totalLessons) * 100);
      }
      percentage = Math.min(100, Math.max(0, percentage));
      
      // حالة الكورس
      let status = 'not-started';
      if (percentage === 100) {
        status = 'completed';
      } else if (percentage > 0) {
        status = 'in-progress';
      }
      
      // بيانات إضافية
      const lastActivity = interactions.lastClicked || p.lastUpdated || p.createdAt;
      const timeSpent = stats.viewTime || 0;
      const quizScore = stats.quizScore || 0;
      
      return {
        ...p,
        percentage,
        status,
        iconColor,
        stats: {
          ...stats,
          timeSpent,
          quizScore,
        },
        interactions: {
          ...interactions,
          lastActivity,
        },
        displayInfo: {
          progressText: `Course Completed ${percentage}%`,
          lessonText: `Lesson ${p.currentLesson || 0} of ${p.courseDetails?.totalLessons || 0}`,
          category: p.courseDetails?.categories?.primary || 'General',
        }
      };
    });
  }
);

// الكورسات الموصى بها مع بيانات التقدم
export const selectRecommendedCoursesWithProgress = createSelector(
  [selectRecommendedCourses, selectUserProgress],
  (recommendedCourses, userProgress) => {
    const userCourseIds = userProgress.map(p => p.courseId);
    const userProgressMap = userProgress.reduce((map, progress) => {
      map[progress.courseId] = progress;
      return map;
    }, {});
    
    return recommendedCourses.map(course => {
      const userProgress = userProgressMap[course.id];
      const isEnrolled = userCourseIds.includes(course.id);
      const progressPercentage = userProgress?.overallProgress || 0;
      
      return {
        ...course,
        isEnrolled,
        userProgress: userProgress || null,
        progressPercentage,
        enrollmentStatus: isEnrolled ? (progressPercentage === 100 ? 'completed' : 'in-progress') : 'not-enrolled',
        canEnroll: !isEnrolled,
        lastAccessed: userProgress?.lastUpdated || null,
      };
    });
  }
);

// بيانات التقدم للبطاقات المعروضة
export const selectProgressForDisplay = createSelector(
  [selectEnrichedProgressData, selectViewMode, selectExpandedCards],
  (enrichedData, viewMode, expandedCards) => {
    return enrichedData.map(item => ({
      ...item,
      isExpanded: expandedCards.includes(item.progressId),
      displayMode: viewMode,
      cardHeight: viewMode === 'grid' ? 150 : 116.94,
      cardWidth: viewMode === 'grid' ? 180 : 280,
    }));
  }
);

// Selector للحصول على تقدم كورس معين
export const selectCourseProgressById = (courseId) => createSelector(
  [selectUserProgress],
  (progress) => progress.find(p => p.courseId === courseId)
);

// Selector للحصول على إحصائيات كورس معين
export const selectCourseStatisticsById = (courseId) => createSelector(
  [selectEnrichedProgressData],
  (enrichedData) => enrichedData.find(item => item.courseId === courseId)?.stats || {}
);

// بيانات للتقدم الكلي
export const selectOverallProgressSummary = createSelector(
  [selectProgressStatistics, selectLastUpdated],
  (statistics, lastUpdated) => ({
    ...statistics,
    lastUpdated,
    formattedDate: lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Never',
    totalStudyTime: statistics.totalLessons * 30, // تقدير 30 دقيقة لكل درس
    estimatedCompletionTime: statistics.averageProgress > 0 
      ? Math.round(((100 - statistics.averageProgress) / statistics.averageProgress) * statistics.totalStudyTime)
      : 0,
    streak: 0, // يمكن إضافته لاحقًا
  })
);

// بيانات للرسم البياني
export const selectProgressChartData = createSelector(
  [selectUserProgress],
  (progress) => {
    const monthlyData = {};
    
    progress.forEach(item => {
      if (item.lastUpdated) {
        const month = new Date(item.lastUpdated).toLocaleString('default', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + (item.overallProgress || 0);
      }
    });
    
    return Object.keys(monthlyData).map(month => ({
      month,
      progress: monthlyData[month],
    }));
  }
);

// فلترة الكورسات حسب التصنيف
export const selectProgressByCategory = createSelector(
  [selectEnrichedProgressData],
  (enrichedData) => {
    const categories = {};
    
    enrichedData.forEach(item => {
      const category = item.displayInfo.category;
      if (!categories[category]) {
        categories[category] = {
          category,
          count: 0,
          totalProgress: 0,
          courses: [],
        };
      }
      
      categories[category].count++;
      categories[category].totalProgress += item.percentage;
      categories[category].courses.push(item);
    });
    
    // تحويل إلى مصفوفة وحساب المتوسط
    return Object.values(categories).map(cat => ({
      ...cat,
      averageProgress: Math.round(cat.totalProgress / cat.count),
    }));
  }
);