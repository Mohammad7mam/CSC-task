import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ProfileImage from '../ui/profileImage';
import {loadUserData} from '../redux/userSlice';

const {width} = Dimensions.get('window');

const HomeHeader = ({progress = 60}) => {
  const dispatch = useDispatch();

  // استخدم useSelector لجلب بيانات المستخدم من Redux
  const {name, isLoading} = useSelector(state => state.user);

  useEffect(() => {
    // تحميل بيانات المستخدم إذا لم تكن محملة بالفعل
    if (!name) {
      dispatch(loadUserData());
    }
  }, [dispatch, name]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
        <ProfileImage />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {name || 'User'}!</Text>
      <ProfileImage />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.875,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    lineHeight: 24 * 1.2,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default HomeHeader;
