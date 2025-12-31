// ui/CourseCard.js
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CourseTxt from './CourseTxt';
import {
  incrementCardPress,
  addToRecentlyViewed,
  markAsViewed,
} from '../redux/courseCardSlice';
import {selectIsFavorite} from '../redux/selectors';

const {width} = Dimensions.get('window');

const CourseCard = ({course}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isFavorite = useSelector(selectIsFavorite(course?.id));
  const imageUri = course?.images?.mainImage;

  const handlePress = () => {
    if (!course?.id) {
      Alert.alert('خطأ', 'معرف الكورس غير متوفر');
      return;
    }

    // تحديث Redux state
    dispatch(incrementCardPress(course.id));
    dispatch(addToRecentlyViewed(course));
    dispatch(markAsViewed(course.id));

    // الانتقال إلى صفحة التفاصيل
    navigation.navigate('Detail', {
      courseId: course.id,
      course: course,
    });
  };

  return (
    <TouchableOpacity
      style={styles.touchableContainer}
      onPress={handlePress}
      activeOpacity={0.7}>
      <View style={styles.mainContainer}>
        {/* مؤشر المفضلة */}
        {isFavorite && (
          <View style={styles.favoriteBadge}>
            <Text style={styles.favoriteText}>★</Text>
          </View>
        )}

        <Image
          source={
            imageUri ? {uri: imageUri} : require('../assets/pngs/image8.png')
          }
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.redContainer}>
          <CourseTxt course={course} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: width * 0.61,
    height: width * 0.605,
    borderRadius: 8,
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 16,
    backgroundColor: '#1F1F1F',
    overflow: 'hidden',
  },
  image: {
    width: width * 0.568,
    height: width * 0.349,
    borderRadius: 8,
    alignSelf: 'center',
  },
  redContainer: {
    position: 'absolute',
    bottom: 16,
    left: 13,
    width: width * 0.541,
    height: width * 0.16,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  favoriteText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CourseCard;
