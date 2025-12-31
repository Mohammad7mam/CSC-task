// ui/CourseTxt.js
import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomText from '../Fonts/CustomText';
import {
  incrementViewCount,
  cacheInstructorImage,
} from '../redux/courseTxtSlice';
import {selectInstructorImage, selectCourseStats} from '../redux/selectors';

const {width} = Dimensions.get('window');

const CourseTxt = ({course}) => {
  const dispatch = useDispatch();

  const cachedImage = useSelector(
    selectInstructorImage(course?.instructor?.id),
  );
  const courseStats = useSelector(selectCourseStats(course?.id));

  useEffect(() => {
    if (course?.id) {
      dispatch(incrementViewCount(course.id));
    }

    // تخزين صورة المدرب في الكاش
    if (course?.instructor?.profileImage && course?.instructor?.id) {
      dispatch(
        cacheInstructorImage({
          instructorId: course.instructor.id,
          imageUri: course.instructor.profileImage,
        }),
      );
    }
  }, [course, dispatch]);

  if (!course) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const primaryCategory = course.categories?.primary || 'Design';
  const title = course.title || 'No Title';
  const instructorName = course.instructor?.name || 'Unknown Instructor';
  const joinYear = course.instructor?.joinYear || 2018;
  const discountedPrice = course.price?.discounted || 0;
  const originalPrice = course.price?.original || 0;
  const enrollmentCount = course.enrollmentCount || 0;
  const instructorImage = cachedImage || course.instructor?.profileImage;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topSection}>
        <CustomText style={styles.designLabel} fontWeight="700">
          {primaryCategory}
        </CustomText>
        <View style={{height: 2}} />
        <CustomText style={styles.titleText} numberOfLines={1} fontWeight="700">
          {title.length > 20 ? `${title.substring(0, 20)}...` : title}
        </CustomText>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.userInfoContainer}>
          <Image
            source={
              instructorImage
                ? {uri: instructorImage}
                : require('../assets/pngs/image8.png')
            }
            style={styles.avatar}
          />
          <View style={styles.userNameEnrolled}>
            <Text style={styles.userName}>{instructorName}</Text>
            <Text style={styles.enrolledText}>{enrollmentCount} Enrolled</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${discountedPrice.toFixed(2)}</Text>
          <Text style={styles.oldPrice}>${originalPrice.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: width * 0.541,
    height: width * 0.16,
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  topSection: {
    alignItems: 'flex-start',
  },
  designLabel: {
    fontSize: 9,
    lineHeight: 10.96,
    color: '#FFFFFF',
  },
  titleText: {
    fontSize: 14,
    lineHeight: 17.53,
    color: '#FFFFFF',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
  },
  userNameEnrolled: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 10.96,
    color: '#FFFFFF',
  },
  enrolledText: {
    fontWeight: '400',
    fontSize: 8,
    lineHeight: 10.96,
    color: '#ADADAD',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentPrice: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 4,
  },
  oldPrice: {
    fontWeight: '400',
    fontSize: 9,
    textDecorationLine: 'line-through',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  viewCount: {
    fontSize: 10,
    color: '#888',
    marginLeft: 5,
  },
});

export default CourseTxt;
