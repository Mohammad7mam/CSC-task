import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

import One from '../assets/WireFrame/Onboarding/One';
import Two from '../assets/WireFrame/Onboarding/Two';
import Three from '../assets/WireFrame/Onboarding/Three';
import Four from '../assets/WireFrame/Onboarding/Four';
import Five from '../assets/WireFrame/Onboarding/Five';

const {width, height} = Dimensions.get('window');

function OnboardingLoading({navigation}) {
  return (
    <View style={styles.container}>
      <One />
      <View style={styles.twoThreeContainer}>
        <Two />
        <Three />
      </View>
      <View style={styles.FourContainer}>
        <Four />
      </View>
      <View style={styles.FiveContainer}>
        <Five />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  twoThreeContainer: {
    marginTop: 28.5,
    gap: 36,
    marginLeft: width * 0.068,
  },
  FourContainer: {
    marginLeft: width * 0.658,
  },
  FiveContainer: {
    marginLeft: width * 0.0625,
    marginTop: 18,
  },
});

export default OnboardingLoading;
