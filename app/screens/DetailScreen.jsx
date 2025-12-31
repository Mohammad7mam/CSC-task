// screens/DetailScreen.js
import React, {useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DetailCombined from '../components/DetailCombined';
import LessonDetals from '../components/LessonDetals';
import CourseDescription from '../components/CourseDescription';
import DetailsList from '../components/DetailsList';
import ButtonWithDetails from '../ui/ButtonWithDetails';
import {
  fetchCourseDetails,
  updateCourseViewCount,
  setCourseFromParams,
  setError, // أضف هذا
  clearError,
  addToRecentlyViewed,
} from '../redux/detailSlice';
import {setScrollPosition} from '../redux/detailCombinedSlice';

const {width, height} = Dimensions.get('window');

function DetailScreen({route, navigation}) {
  const dispatch = useDispatch();
  const {courseId, course} = route.params || {};

  // Select data from Redux store
  const courseDetails = useSelector(state => state.detail.course);
  const loading = useSelector(state => state.detail.loading);
  const error = useSelector(state => state.detail.error);

  const handleScroll = useCallback(
    event => {
      const offsetY = event.nativeEvent.contentOffset.y;
      dispatch(setScrollPosition(offsetY));
    },
    [dispatch],
  );

  useEffect(() => {
    const initializeCourse = () => {
      if (course) {
        // إذا كان course موجوداً في params، استخدمه مباشرة
        dispatch(setCourseFromParams({course}));

        // تحديث عدد المشاهدات للكورس
        if (course.id) {
          dispatch(updateCourseViewCount(course.id));
        }
      } else if (courseId) {
        // إذا كان هناك courseId فقط، جلب البيانات من Firebase
        dispatch(fetchCourseDetails(courseId));

        // تحديث عدد المشاهدات
        dispatch(updateCourseViewCount(courseId));
      } else {
        dispatch(setError('No course or courseId provided'));
      }
    };

    initializeCourse();
  }, [courseId, course, dispatch]);

  useEffect(() => {
    if (courseDetails?.title) {
      navigation.setOptions({title: courseDetails.title});
    }
  }, [courseDetails, navigation]);

  useEffect(() => {
    if (courseDetails) {
      dispatch(addToRecentlyViewed(courseDetails));
    }
  }, [courseDetails, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading course details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!courseDetails) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundLayer}>
        <DetailCombined course={courseDetails} />
      </View>

      <ScrollView
        style={styles.foregroundLayer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <View style={styles.transparentSpacer} />

        <View style={styles.contentWrapper}>
          <LessonDetals course={courseDetails} />
          <CourseDescription course={courseDetails} />
          <DetailsList course={courseDetails} />
          <ButtonWithDetails
            text="Enroll in this course"
            notificationMessage="مرحبًا بك في دورة React Native!"
            notificationTitle="Home"
            courseId={courseId || courseDetails.id}
            course={courseDetails}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    zIndex: 1,
  },
  foregroundLayer: {
    flex: 1,
    zIndex: 2,
  },
  transparentSpacer: {
    height: height * 0.34,
    backgroundColor: 'transparent',
  },
  contentWrapper: {
    backgroundColor: '#1F1F1F',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: height * 0.64,
    alignItems: 'center',
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161616',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#161616',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DetailScreen;
