// components/SecondCourse.js
import React, {useEffect} from 'react';
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CourseCard from '../ui/CourseCard';
import CustomText from '../Fonts/CustomText';
import {setCourseList} from '../redux/secondCourseSlice';
import {selectFilteredCourses} from '../redux/selectors';

const {width} = Dimensions.get('window');

const SecondCourse = ({courses = [], categoryName = 'Top Courses for you'}) => {
  const dispatch = useDispatch();
  const filteredCourses = useSelector(selectFilteredCourses);

  useEffect(() => {
    // تحديث قائمة الكورسات في Redux
    if (courses.length > 0) {
      dispatch(setCourseList(courses));
    }
  }, [courses, dispatch]);

  const displayCourses = courses.length > 0 ? courses : filteredCourses;

  return (
    <View style={styles.container}>
      <CustomText style={styles.title} fontWeight="500">
        {categoryName}
      </CustomText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {displayCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: width * 0.0625,
    height: 311,
    marginTop: 26,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    width: '100%',
    marginBottom: 20,
  },
  scrollContent: {
    gap: 20,
  },
});

export default SecondCourse;
