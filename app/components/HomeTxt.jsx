import React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import OnboardingShape from '../assets/svgs/OnboardingShape';
import CustomText from '../Fonts/CustomText';

const screenWidth = Dimensions.get('window').width;

const HomeTxt = () => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.mainText} fontWeight="700">
        Find best {'\n'}
        course for you
      </CustomText>
      <CustomText style={styles.subText} fontWeight="400">
        We have more than 90+ courses
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.875,
    alignItems: 'flex-start',
    marginTop: 15,
  },
  mainText: {
    fontSize: 36,
    letterSpacing: 0,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  subText: {
    fontSize: 14,
    lineHeight: 18, // 158% line height
    letterSpacing: 0,
    color: '#ADADAD',
    marginLeft: screenWidth * 0.004582781,
    marginTop: 9,
  },
});

export default HomeTxt;
