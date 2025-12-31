// components/DetailHeader.js
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomText from '../Fonts/CustomText';
import {
  setHeaderData,
  toggleTitleExpanded,
  incrementTitleClicks,
  incrementInstructorClicks,
  updateHeaderFromCourse,
} from '../redux/detailHeaderSlice';
import {
  selectFormattedHeaderData,
  selectHeaderStyles,
} from '../redux/detailSelectors';

const {width} = Dimensions.get('window');

const DetailHeader = ({course}) => {
  const dispatch = useDispatch();

  // Select data from Redux
  const headerData = useSelector(selectFormattedHeaderData);
  const headerStyles = useSelector(selectHeaderStyles);

  useEffect(() => {
    if (course) {
      dispatch(updateHeaderFromCourse(course));
    }
  }, [course, dispatch]);

  const handleTitlePress = () => {
    if (headerData.hasLongTitle) {
      dispatch(toggleTitleExpanded());
    }
    dispatch(incrementTitleClicks());
  };

  const handleInstructorPress = () => {
    dispatch(incrementInstructorClicks());
    // يمكن إضافة navigation لصفحة المدرب هنا
  };

  return (
    <View style={[styles.container, headerStyles.container]}>
      <TouchableOpacity onPress={handleTitlePress} activeOpacity={0.7}>
        <CustomText
          style={[styles.title, headerStyles.title]}
          fontWeight="600"
          numberOfLines={headerData.textFormat.numberOfLines}
          ellipsizeMode={headerData.textFormat.ellipsizeMode}>
          {headerData.displayTitle}
        </CustomText>
        {headerData.hasLongTitle && (
          <Text style={styles.expandHint}>
            {headerData.isTitleExpanded ? 'Tap to collapse' : 'Tap to expand'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleInstructorPress}
        activeOpacity={0.7}
        style={styles.subtitleContainer}>
        <View
          style={[styles.subtitleContainer, headerStyles.subtitleContainer]}>
          <CustomText style={styles.subtitleLabel} fontWeight="500">
            Offered by:
          </CustomText>
          <CustomText style={styles.subtitleValue} fontWeight="600">
            {headerData.instructorName}
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 0.0585 * width,
    width: width * 0.85,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitleContainer: {
    flexDirection: 'row',
  },
  subtitleLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#B7B7B7',
  },
  subtitleValue: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  expandHint: {
    fontSize: 10,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default DetailHeader;
