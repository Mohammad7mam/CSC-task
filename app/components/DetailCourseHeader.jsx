import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Back from '../assets/svgs/Back'; // Assuming this is an SVG component for the back icon
import Save from '../assets/svgs/Save'; // Assuming this is an SVG component for the save icon
import CustomText from '../Fonts/CustomText';
const {width, height} = Dimensions.get('window');

const DetailCourseHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Back /> {/* Back icon on the far left */}
        <CustomText style={styles.title}>Detail Course</CustomText>
      </View>
      <TouchableOpacity style={styles.rightButton}>
        <Save /> {/* Save button on the far right */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#FF0000', // Red background as shown in the image
    width: width * 0.9,
    marginLeft: width * 0.05,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // 16px gap between back icon and text
  },
  title: {
    fontSize: 16,
    lineHeight: 24, // 150% of 16px = 24px
    letterSpacing: 0.24, // 1.5% of 16px = 0.24px
    color: '#FFFFFF',
  },
  rightButton: {
    // Add any additional styles if needed for the button
  },
});

export default DetailCourseHeader;
