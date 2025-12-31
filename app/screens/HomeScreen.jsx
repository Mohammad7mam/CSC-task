// screens/HomeScreen.js
import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import HeaderComponent from '../components/HomeHeader';
import HomeTxt from '../components/HomeTxt';
import SearchBar from '../components/SearchBar';
import UpcomingTasks from '../components/UpcomingTasks';
import SecondCourse from '../components/SecondCourse';
import {fetchHomeData} from '../redux/homeSlice';
import {
  selectHomeLoading,
  selectHomeError,
  selectTopCourses,
  selectCategoryName,
  selectPrimaryCategories,
} from '../redux/selectors';

const {width, height} = Dimensions.get('window');

function HomeScreen({navigation}) {
  const dispatch = useDispatch();

  const loading = useSelector(selectHomeLoading);
  const error = useSelector(selectHomeError);
  const topCourses = useSelector(selectTopCourses);
  const categoryName = useSelector(selectCategoryName);
  const primaryCategories = useSelector(selectPrimaryCategories);

  useEffect(() => {
    dispatch(fetchHomeData());

    return () => {
      // Cleanup إذا لزم الأمر
    };
  }, [dispatch]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={{color: '#FFFFFF'}}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea} />
      <SafeAreaView style={styles.bottomSafeArea} />

      <StatusBar barStyle="light-content" backgroundColor="#161616" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topSpacer} />

        <HeaderComponent />
        <HomeTxt />
        <SearchBar />

        <SecondCourse courses={topCourses} categoryName={categoryName} />

        <UpcomingTasks primaryCategories={primaryCategories} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// ... باقي الأنماط كما هي

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Safe Area العلوية - ثابتة في الأعلى
  topSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.04, // 4% من طول الشاشة
    backgroundColor: '#161616',
    zIndex: 1000,
  },
  // Safe Area السفلية - ثابتة في الأسفل
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.05, // 5% من طول الشاشة
    backgroundColor: '#161616',
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    // لا نضع paddingBottom هنا لأننا نستخدم bottomSpacer
  },
  // مساحة علوية داخل الـ ScrollView لتعويض الـ Safe Area العلوية
  topSpacer: {
    height: height * 0.04,
    width: '100%',
  },
  // مساحة سفلية داخل الـ ScrollView لتعويض الـ Safe Area السفلية
  bottomSpacer: {
    height: height * 0.05,
    width: '100%',
    marginBottom: 100,
  },
});

export default HomeScreen;
