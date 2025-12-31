import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/native';

// استيراد الأيقونات الخاصة بك
import Book from '../assets/svgs/BottomBar/Book';
import DateIcon from '../assets/svgs/BottomBar/Date';
import Home from '../assets/svgs/BottomBar/Home';
import Like from '../assets/svgs/BottomBar/Like';
import Profile from '../assets/svgs/BottomBar/Profile';

import Back from '../assets/svgs/Back';
import Save from '../assets/svgs/Save';

const {width, height} = Dimensions.get('window');

const CustomBottomBar = () => {
  const navigation = useNavigation();
  const state = useNavigationState(state => state);
  const currentRouteName = state?.routes[state.index]?.name;

  const tabs = [
    {name: 'Home', Component: Home, badge: 0},
    {name: 'OnboardingLoding', Component: DateIcon, badge: 0},
    {name: 'Progress', Component: Book, badge: 0, isCenter: true},
    {name: 'Detail', Component: Like, badge: 0},
    {name: 'Welcome', Component: Profile, badge: 0},
  ];

  const ACTIVE_COLOR = '#7C6AF1';

  // دالة لتحديد ما إذا كان التبويب نشطاً
  const isTabSelected = tabName => {
    // إذا كنا في صفحة Detail، فاعتبر فقط Home نشطاً
    if (currentRouteName === 'Detail') {
      return tabName === 'Home';
    }
    // في الصفحات الأخرى، استخدم المنطق الطبيعي
    return currentRouteName === tabName;
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isSelected = isTabSelected(tab.name);
        const Icon = tab.Component;

        return (
          <TouchableOpacity
            key={index}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(tab.name)}>
            <View
              style={[
                tab.isCenter ? styles.centerIconWrapper : null,
                tab.isCenter && isSelected
                  ? {
                      borderColor: ACTIVE_COLOR,
                      backgroundColor: ACTIVE_COLOR,
                      shadowColor: ACTIVE_COLOR,
                    }
                  : null,
              ]}>
              <Icon
                width={24}
                height={24}
                fill={isSelected ? ACTIVE_COLOR : 'transparent'}
                stroke={isSelected ? ACTIVE_COLOR : '#FFFFFF'}
              />
            </View>

            {tab.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{tab.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 78,
    backgroundColor: '#1F1F1F',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: height * 0.05,
    width: width,
    alignSelf: 'center',
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  centerIconWrapper: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    elevation: 16,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
});

export default CustomBottomBar;
