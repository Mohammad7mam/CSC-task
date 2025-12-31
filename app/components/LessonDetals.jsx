// components/LessonDetals.js
import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';

import LessonComponent from '../ui/LessonComponent';
import List from '../assets/svgs/Detail/list';
import Clock from '../assets/svgs/Detail/Clock';
import Star from '../assets/svgs/Detail/Star';

const {width: screenWidth} = Dimensions.get('window');

const LessonDetals = ({course}) => {
  // استخدام البيانات من course مع قيم افتراضية
  const totalLessons = course?.totalLessons || 0;
  const averageRating = course?.rating?.average || 0;
  const totalReviews = course?.rating?.totalReviews || 0;
  const totalWeeks = course?.totalWeeks || 0;

  // تنسيق النص للتصنيف
  const ratingText = `${averageRating.toFixed(1)} (${totalReviews}+)`;

  // تنسيق النص للدروس
  const lessonsText = `${totalLessons} ${
    totalLessons === 1 ? 'Lesson' : 'Lessons'
  }`;

  // تنسيق النص للأسابيع
  const weeksText = `${totalWeeks} ${totalWeeks === 1 ? 'Week' : 'Weeks'}`;

  return (
    <View style={styles.container}>
      <LessonComponent Icon={List} text={lessonsText} />

      <LessonComponent
        Icon={Star}
        text={ratingText}
        textProps={{italic: true}} // إضافة props إضافية للنص
      />

      <LessonComponent Icon={Clock} text={weeksText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.875,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 27,
  },
});

export default LessonDetals;
