// components/DetailsList.js
import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import FrameDetails from '../ui/FrameDetails';

const {width: screenWidth} = Dimensions.get('window');

const DetailsList = ({course}) => {
  // استخراج أول 3 نقاط من whatYouWillLearn
  const getLearningPoints = () => {
    const whatYouWillLearn = course?.whatYouWillLearn;

    if (!whatYouWillLearn) {
      // قيم افتراضية إذا لم تكن البيانات متوفرة
      return [
        'Gain the essential skills for making yourself job-ready',
        'Displaying your projects in a personal portfolio to showcase your talent',
        'Applying to jobs on various platforms',
      ];
    }

    // تحويل object إلى array وأخذ أول 3 عناصر
    const points = Object.values(whatYouWillLearn);
    return points.slice(0, 3);
  };

  const learningPoints = getLearningPoints();

  // ألوان مختلفة لكل عنصر
  const iconColors = ['#FFD6A5', '#FFC6FF', '#BDB2FF'];

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>What you'll learn</Text>

      {/* عرض نقاط التعلم */}
      {learningPoints.map((text, index) => (
        <FrameDetails
          key={index}
          text={text}
          iconColor={iconColors[index % iconColors.length]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: screenWidth * 0.0625,
    width: screenWidth * 0.875,
    marginTop: 12,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    color: '#ADADAD',

    fontWeight: '500',
    marginBottom: 8,
  },
});

export default DetailsList;
