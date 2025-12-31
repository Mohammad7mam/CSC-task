// components/DetailCombined.js
import React, {useEffect} from 'react';
import {View, ImageBackground, Dimensions, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DetailCourseHeader from './DetailCourseHeader';
import DetailHeader from './DetailHeader';
import {
  setBackgroundImage,
  setBackgroundLoaded,
  setImageLoading,
  setImageError,
} from '../redux/detailCombinedSlice';
import {selectBackgroundImageWithFallback} from '../redux/detailSelectors';

const {width} = Dimensions.get('window');

const DetailCombined = ({course}) => {
  const dispatch = useDispatch();
  const backgroundImage = useSelector(selectBackgroundImageWithFallback);

  useEffect(() => {
    if (course?.images?.aboutImage) {
      dispatch(setImageLoading(true));
      dispatch(setBackgroundImage(course.images.aboutImage));

      // محاكاة تحميل الصورة
      const timer = setTimeout(() => {
        dispatch(setImageLoading(false));
        dispatch(setBackgroundLoaded(true));
      }, 500);

      return () => clearTimeout(timer);
    } else {
      dispatch(setBackgroundLoaded(true));
    }
  }, [course?.images?.aboutImage, dispatch]);

  const handleImageLoad = () => {
    dispatch(setImageLoading(false));
    dispatch(setBackgroundLoaded(true));
  };

  const handleImageError = () => {
    dispatch(setImageError('Failed to load background image'));
    dispatch(setImageLoading(false));
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
      onLoad={handleImageLoad}
      onError={handleImageError}>
      <View style={styles.overlay}>
        <View style={styles.courseHeaderContainer}>
          <DetailCourseHeader course={course} />
        </View>

        <View style={styles.headerContainer}>
          <DetailHeader course={course} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: width,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  courseHeaderContainer: {
    position: 'absolute',
    top: 70,
    width: '100%',
  },
  headerContainer: {
    position: 'absolute',
    bottom: 130,
    width: '100%',
  },
});

export default DetailCombined;
