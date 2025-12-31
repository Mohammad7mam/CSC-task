import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import OnboardingShape from '../assets/svgs/OnboardingShape';
import CustomText from '../Fonts/CustomText';

const screenWidth = Dimensions.get('window').width;

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.mainText} fontWeight="700">
        Strat learning {"\n"}
        anywhere, and build your bright career.
      </CustomText>
      <CustomText style={styles.subText } fontWeight="400">
        Basic to advance level of designing with expert instructor and fee bonus classes
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.875,
    alignItems: 'flex-start',
marginTop:18
  },
  mainText: {
    fontSize: 33,
    lineHeight: 45,
    letterSpacing: 0,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  subText: {
    width: screenWidth * 0.84,
    fontSize: 14,
    lineHeight: 14 * 1.58, // 158% line height
    letterSpacing: 0,
    color: '#ADADAD',
    marginLeft: screenWidth * 0.04582781,
  },
});

export default MyComponent;