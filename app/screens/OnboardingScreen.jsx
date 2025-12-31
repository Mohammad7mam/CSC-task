// screens/Onboarding.js
import React from 'react';
import {View, Text, Button, StyleSheet, Dimensions} from 'react-native';
import CustomText from '../Fonts/CustomText';

import OnboardingHeroImg from '../components/OnboardingHeroImg';
import OnboardingTxt from '../components/OnboardingTxt';
import ButtonWithNotification from '../ui/ButtonWithNotification';

import OnboardingShape from '../assets/svgs/OnboardingShape';
import Circle from '../assets/svgs/circle';

const {width, height} = Dimensions.get('window');

function Onboarding({navigation}) {
  return (
    <View style={styles.container}>
      {/* السيركل في الخلفية */}
      <View style={styles.circleBackground1}>
        <Circle  fillOpacity={0.05} />
      </View>
 {/* السيركل الثاني في الخلفية */}
      <View style={styles.circleBackground2}>
        <Circle fillOpacity={0.05} />
      </View>
      <View style={styles.topSpace} />
      <OnboardingHeroImg />
      <OnboardingTxt />
      <View style={styles.Shape}>
        <OnboardingShape />
      </View>
      <ButtonWithNotification
        notificationMessage="مرحبًا بك في دورة React Native!"
        notificationTitle="Login"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#161616',
    zIndex: -1,
  },
  topSpace: {
    height: height * 0.04,
  },
  text: {
    fontSize: 32,
    marginBottom: 10,
    color: '#2c3e50',
  },
  subText: {
    fontSize: 18,
    marginBottom: 30,
    color: '#7f8c8d',
  },
  Shape: {
    width: width,
    paddingRight: width * 0.19466,
    marginTop: -1,
    direction:"rtl"
  },
  // ستايل جديد للسيركل في الخلفية
  circleBackground1: {
    position: 'absolute',
    top: -197,
    left: -113,
    zIndex: -1,
  },
   circleBackground2: {
    position: 'absolute',
    top: 253,
    right: -138,
    zIndex: -1,
  },
});

export default Onboarding;
