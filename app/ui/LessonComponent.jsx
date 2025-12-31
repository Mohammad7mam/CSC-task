import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomText from '../Fonts/CustomText';

const LessonComponent = ({Icon, text, textProps = {}}) => {
  // تأكد من أن Icon هو مكون React صالح
  const SvgIcon = Icon || null;

  return (
    <View style={styles.container}>
      {SvgIcon && <SvgIcon />}
      <CustomText style={styles.text} {...textProps}>
        {text}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    fontSize: 14,
    lineHeight: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4, // إضافة مسافة بين الـ SVG والنص
  },
});

export default LessonComponent;
