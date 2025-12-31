// components/CourseDescription.js
import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import CustomText from '../Fonts/CustomText';

const CourseDescription = ({course}) => {
  const screenWidth = Dimensions.get('window').width;

  // استخدام البيانات من course مع قيمة افتراضية
  const descriptionText =
    course?.aboutThisCourse ||
    'Graphic design is all around us, in a myriad of forms, both on screen and in print, yet it is always made up of images and words to create a communication goal. This four-course sequence exposes students to the fundamental skills required to make sophisticated graphic';

  return (
    <View style={[styles.container, {width: screenWidth * 0.875}]}>
      <CustomText style={styles.subtitle} fontWeight="500">
        About this course
      </CustomText>
      <CustomText
        style={styles.description}
        numberOfLines={4}
        ellipsizeMode="tail"
        fontWeight="300">
        {descriptionText}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#ADADAD',
    marginBottom: 7,
  },
  description: {
    fontSize: 16,
    lineHeight: 20.64, // 16 * 1.29
    color: '#FFFFFF',
  },
});

export default CourseDescription;
