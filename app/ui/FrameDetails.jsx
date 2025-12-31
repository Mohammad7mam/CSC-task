import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Arrow from '../assets/svgs/Detail/arrow';

// نضيف prop للون
const FrameDetails = ({text, iconColor}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        {/* تمرير اللون إلى المكون الحفيد */}
        <Arrow fillColor={iconColor} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    flexDirection: 'row',
    borderRadius: 4,
    gap: 12,
    marginBottom: 8,
  },
  iconWrapper: {
    alignSelf: 'flex-start',
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
    textAlign: 'left',
    fontFamily: 'System',
  },
});

export default FrameDetails;