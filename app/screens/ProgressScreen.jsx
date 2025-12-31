// screens/ProgressScreen.js
import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions, ScrollView, Animated} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Circle from '../assets/svgs/circle';
import WeeklyCalenffdar from '../components/WeeklyCalen';
import YourProgress from '../components/YourProgress';
import SecondCourse from '../components/SecondCourse';
import CustomText from '../Fonts/CustomText';
import {
  fetchRecommendedCourses,
  fetchUserProgress,
} from '../redux/progressSlice';
import {
  selectRecommendedCourses,
  selectRecommendedCategoryName,
  selectProgressLoading,
  selectProgressError,
} from '../redux/progressSelectors';

const {width, height} = Dimensions.get('window');

function ProgressScreen({navigation}) {
  const dispatch = useDispatch();
  const scrollY = useRef(new Animated.Value(0)).current;

  const recommendedCourses = useSelector(selectRecommendedCourses);
  const recommendedCategoryName = useSelector(selectRecommendedCategoryName);
  const loading = useSelector(selectProgressLoading);
  const error = useSelector(selectProgressError);

  useEffect(() => {
    dispatch(fetchRecommendedCourses());
    dispatch(fetchUserProgress());
  }, [dispatch]);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: false},
  );

  return (
    <View style={styles.container}>
      {/* الجزء الثابت في الأعلى مع الخلفية */}
      <View style={styles.headerContainer}>
        <View style={styles.circleBackground1}>
          <Circle fillOpacity={0.05} />
        </View>
        <View style={styles.fixedHeader}>
          <WeeklyCalenffdar />
        </View>
      </View>

      {/* محتوى السكرول */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <View style={styles.headerSpacer} />

        <YourProgress />

        {/* عرض الكورسات الموصى بها */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <CustomText style={styles.loadingText}>
              Loading courses...
            </CustomText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <CustomText style={styles.errorText}>{error}</CustomText>
          </View>
        ) : recommendedCourses.length > 0 ? (
          <SecondCourse
            courses={recommendedCourses}
            categoryName={recommendedCategoryName || 'Recommended Courses'}
          />
        ) : (
          <View style={styles.noCoursesContainer}>
            <CustomText style={styles.noCoursesText}>
              No recommended courses found
            </CustomText>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// الأنماط تبقى كما هي...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#161616',
  },
  circleBackground1: {
    position: 'absolute',
    top: -197,
    left: -113,
    zIndex: 10,
  },
  fixedHeader: {
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginTop: 0.125 * height,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 78,
  },
  headerSpacer: {
    height: 200,
    width: '100%',
  },
  noCoursesContainer: {
    marginTop: 26,
    marginLeft: width * 0.0625,
    padding: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    width: '90%',
  },
  noCoursesText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  bottomSpacer: {
    height: height * 0.07,
    width: '100%',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
  },
});

export default ProgressScreen;
