// store/selectors.js
import { createSelector } from '@reduxjs/toolkit';

// Selectors للـ HomeScreen
export const selectHomeData = (state) => state.home;
export const selectTopCourses = (state) => state.home.topCourses;
export const selectCategoryName = (state) => state.home.categoryName;
export const selectPrimaryCategories = (state) => state.home.primaryCategories;
export const selectHomeLoading = (state) => state.home.isLoading;
export const selectHomeError = (state) => state.home.error;

// Selector محسّن للـ HomeScreen
export const selectFormattedHomeData = createSelector(
  [selectTopCourses, selectCategoryName, selectPrimaryCategories],
  (topCourses, categoryName, primaryCategories) => ({
    hasCourses: topCourses.length > 0,
    coursesCount: topCourses.length,
    categoryDisplayName: categoryName || 'Top Courses for you',
    primaryCategoriesCount: primaryCategories.length,
  })
);

// Selectors للـ SecondCourse
export const selectSecondCourse = (state) => state.secondCourse;
export const selectSelectedCourse = (state) => state.secondCourse.selectedCourse;
export const selectCourseList = (state) => state.secondCourse.courseList;
export const selectFilteredCourses = createSelector(
  [selectCourseList, (state) => state.secondCourse.filter],
  (courses, filter) => {
    if (filter === 'all') return courses;
    return courses.filter(course => 
      course.categories?.primary === filter
    );
  }
);

// Selectors للـ CourseCard
export const selectCourseCard = (state) => state.courseCard;
export const selectExpandedCardId = (state) => state.courseCard.expandedCardId;
export const selectFavorites = (state) => state.courseCard.favorites;
export const selectRecentlyViewed = (state) => state.courseCard.recentlyViewed;
export const selectIsFavorite = (courseId) => createSelector(
  [selectFavorites],
  (favorites) => favorites.includes(courseId)
);

// Selectors للـ CourseTxt
export const selectCourseTxt = (state) => state.courseTxt;
export const selectInstructorImage = (instructorId) => createSelector(
  [selectCourseTxt],
  (courseTxt) => courseTxt.instructorImages[instructorId]
);
export const selectCourseStats = (courseId) => createSelector(
  [selectCourseTxt],
  (courseTxt) => courseTxt.courseStats[courseId] || { viewCount: 0 }
);


// // store/selectors.js
// import { createSelector } from '@reduxjs/toolkit';

// // Progress Screen Selectors
// export const selectProgressData = (state) => state.progress;
// export const selectRecommendedCourses = (state) => state.progress.recommendedCourses;
// export const selectProgressList = (state) => state.progress.progressData;
// export const selectCurrentUserProgress = (state) => state.progress.currentUser;

// // Selector محسّن للكورسات مع التقدم
// export const selectCoursesWithProgress = createSelector(
//   [selectRecommendedCourses, selectProgressList],
//   (courses, progressList) => {
//     return courses.map(course => {
//       const userProgress = progressList.find(progress => 
//         progress.courseId === course.id
//       );
//       return {
//         ...course,
//         userProgress: userProgress || null,
//         hasProgress: !!userProgress,
//         progressPercentage: userProgress?.overallProgress || 0,
//       };
//     });
//   }
// );

// // Selector لإحصائيات التقدم
// export const selectProgressStatistics = createSelector(
//   [selectProgressList],
//   (progressList) => {
//     const totalCourses = progressList.length;
//     const completedCourses = progressList.filter(p => p.overallProgress >= 100).length;
//     const averageProgress = progressList.reduce((sum, p) => sum + (p.overallProgress || 0), 0) / (totalCourses || 1);
    
//     return {
//       totalCourses,
//       completedCourses,
//       inProgressCourses: totalCourses - completedCourses,
//       averageProgress: Math.round(averageProgress),
//       completionRate: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0,
//     };
//   }
// );