// store/detailSelectors.js
import { createSelector } from '@reduxjs/toolkit';

import {View, ImageBackground, Dimensions, StyleSheet} from 'react-native';


// Basic Selectors
export const selectDetailState = (state) => state.detail;
export const selectDetailCombinedState = (state) => state.detailCombined;
export const selectDetailHeaderState = (state) => state.detailHeader;

// Detail Slice Selectors
export const selectCourse = (state) => state.detail.course;
export const selectDetailLoading = (state) => state.detail.loading;
export const selectDetailError = (state) => state.detail.error;
export const selectRelatedCourses = (state) => state.detail.relatedCourses;
export const selectIsEnrolled = (state) => state.detail.isEnrolled;
export const selectCurrentCourseId = (state) => state.detail.currentCourseId;
export const selectLastViewedCourses = (state) => state.detail.lastViewedCourses;

// DetailCombined Slice Selectors
export const selectBackgroundImage = (state) => state.detailCombined.backgroundImage;
export const selectImageLoading = (state) => state.detailCombined.imageLoading;
export const selectHeaderOpacity = (state) => state.detailCombined.headerOpacity;
export const selectScrollPosition = (state) => state.detailCombined.scrollPosition;
export const selectParallaxOffset = (state) => state.detailCombined.parallaxOffset;
export const selectAnimationConfig = (state) => state.detailCombined.animationConfig;

// DetailHeader Slice Selectors
export const selectHeaderTitle = (state) => state.detailHeader.title;
export const selectInstructorName = (state) => state.detailHeader.instructorName;
export const selectIsTitleExpanded = (state) => state.detailHeader.isTitleExpanded;
export const selectTextFormat = (state) => state.detailHeader.textFormat;
export const selectDisplaySettings = (state) => state.detailHeader.displaySettings;

// Memoized Selectors for Performance
export const selectCourseDetails = createSelector(
  [selectCourse],
  (course) => {
    if (!course) return null;
    
    return {
      id: course.id,
      title: course.title || 'No Title',
      shortDescription: course.shortDescription || 'No description available',
      fullDescription: course.description || 'No description available',
      instructor: course.instructor || { name: 'Unknown Instructor' },
      images: course.images || {},
      categories: course.categories || {},
      price: course.price || {},
      rating: course.rating || 0,
      duration: course.duration || 'N/A',
      lessons: course.lessons || [],
      requirements: course.requirements || [],
      whatYouWillLearn: course.whatYouWillLearn || [],
      enrollmentCount: course.enrollmentCount || 0,
      viewCount: course.viewCount || 0,
      createdAt: course.createdAt || null,
      updatedAt: course.updatedAt || null,
    };
  }
);

export const selectFormattedHeaderData = createSelector(
  [selectHeaderTitle, selectInstructorName, selectIsTitleExpanded, selectTextFormat],
  (title, instructorName, isTitleExpanded, textFormat) => ({
    title: title || 'Course description not available',
    instructorName: instructorName || 'Unknown Instructor',
    isTitleExpanded,
    textFormat: {
      ...textFormat,
      ellipsizeMode: isTitleExpanded ? 'tail' : 'tail',
    },
    displayTitle: title.length > 100 && !isTitleExpanded 
      ? `${title.substring(0, 100)}...` 
      : title,
    hasLongTitle: title.length > 100,
  })
);

export const selectBackgroundImageWithFallback = createSelector(
  [selectBackgroundImage, selectCourse],
  (backgroundImage, course) => {
    if (backgroundImage) return { uri: backgroundImage };
    
    // استخدام الصورة من الكورس أو الصورة الافتراضية
    const courseImage = course?.images?.aboutImage;
    if (courseImage) return { uri: courseImage };
    
    return require('../assets/pngs/Rectangle-7217.png');
  }
);

export const selectHeaderStyles = createSelector(
  [selectHeaderOpacity, selectParallaxOffset, selectScrollPosition],
  (opacity, parallaxOffset, scrollPosition) => ({
    container: {
      marginLeft: 0.0585 * Dimensions.get('window').width,
      width: Dimensions.get('window').width * 0.85,
      opacity,
      transform: [{ translateY: parallaxOffset }],
    },
    title: {
      fontSize: 24,
      lineHeight: 32,
      color: '#FFFFFF',
      marginBottom: 8,
      opacity: Math.max(0.7, opacity),
    },
    subtitleContainer: {
      flexDirection: 'row',
      opacity: Math.max(0.5, opacity),
    },
  })
);

export const selectDetailScreenData = createSelector(
  [selectCourseDetails, selectDetailLoading, selectDetailError, selectRelatedCourses],
  (courseDetails, loading, error, relatedCourses) => ({
    course: courseDetails,
    loading,
    error,
    relatedCourses,
    hasData: !!courseDetails,
    canShowRelated: relatedCourses.length > 0 && !loading && !error,
    shouldShowError: !loading && error,
    shouldShowLoading: loading && !courseDetails,
  })
);

export const selectEnrollmentInfo = createSelector(
  [selectCourse, selectIsEnrolled],
  (course, isEnrolled) => {
    if (!course) return null;
    
    return {
      courseId: course.id,
      courseTitle: course.title,
      price: course.price || {},
      isEnrolled,
      canEnroll: !isEnrolled,
      enrollmentButtonText: isEnrolled ? 'Go to Course' : 'Enroll Now',
      enrollmentButtonColor: isEnrolled ? '#4CAF50' : '#7C6AF1',
    };
  }
);

export const selectRecentCourses = createSelector(
  [selectLastViewedCourses, selectCurrentCourseId],
  (lastViewedCourses, currentCourseId) => {
    // استبعاد الكورس الحالي من القائمة
    return lastViewedCourses
      .filter(course => course.id !== currentCourseId)
      .slice(0, 5); // أخذ أول 5 كورسات فقط
  }
);