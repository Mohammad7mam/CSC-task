import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';

import OnboardingBack from '../assets/svgs/OnboardingBack';
import OnboardingSecond from '../assets/svgs/OnboardingSecond';

const {width, height} = Dimensions.get('window');

const LayeredOnboarding = () => {
  return (
    <View style={styles.container}>
      {/* الحاوية الموحدة للثلاثة مكونات */}
      <View style={styles.sharedBottomContainer}>
        {/* الطبقة الأولى: الخلفية SVG - بالأسفل */}
        <View style={[styles.layer, {zIndex: 1}]}>
          <OnboardingBack />
        </View>

        {/* الطبقة الثانية: الصورة PNG - بالأسفل */}
        <View style={[styles.layer, {zIndex: 2}]}>
          <Image
            source={require('../assets/pngs/wepik-photo-mode-2022722-20254-2.png')}
            style={styles.centerImage}
            resizeMode="contain"
          />
        </View>

        {/* الطبقة الثالثة: المكون SVG العلوي - مع تحكم في البوسشن */}
        <View style={[styles.thirdLayerCustom, {zIndex: 3}]}>
          <OnboardingSecond />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"red"
  },
  sharedBottomContainer: {
    width: width,
    height: height * 0.5,
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  centerImage: {
    height: width * 1.132133333333333,
    position: 'absolute',
    bottom: 0,
  },
  // ستايل خاص للطبقة الثالثة للتحكم الكامل في البوسشن
  thirdLayerCustom: {
    position: 'absolute',

    bottom: width * 0.0462962962962963, // أنزل للأسفل قليلاً

    right: width * -0.0138888888888889, // حرك لليسار خارج الشاشة

    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default LayeredOnboarding;
