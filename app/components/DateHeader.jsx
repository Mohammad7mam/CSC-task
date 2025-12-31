import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import ProfileImage from '../ui/profileImage';
import CustomText from '../Fonts/CustomText';

const {width: screenWidth} = Dimensions.get('window');

const DateHeader = () => {
  // دالة للحصول على التاريخ الحالي بتنسيق "March 25, 2024"
  const getCurrentDate = () => {
    const today = new Date();
    
    // أسماء الأشهر بالإنجليزية
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const month = monthNames[today.getMonth()];
    const day = today.getDate();
    const year = today.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };
  
  // دالة بديلة باستخدام Intl.DateTimeFormat (أكثر موثوقية)
  const getFormattedDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <CustomText fontWeight="400" style={styles.dateText}>
          {getFormattedDate()}
        </CustomText>
        <CustomText fontWeight="700" style={styles.todayText}>
          Today
        </CustomText>
      </View>

      <View style={styles.circleContainer}>
        <ProfileImage />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.875,
    height: 59,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  textContainer: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    lineHeight: 16 * 1.5, // 150% line height
    letterSpacing: 16 * 0.015, // 1.5% letter spacing
    color: '#FFFFFF',
  },
  todayText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 5, // gap 5px بين النصين
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DateHeader;