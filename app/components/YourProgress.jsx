// components/YourProgress.js
import React, {useEffect} from 'react';
import {View, Dimensions, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import YourProgressSingle from './YourProgressSingle';
import CustomText from '../Fonts/CustomText';
import {fetchUserProgress} from '../redux/progressSlice';
import {selectEnrichedProgressData} from '../redux/progressSelectors';
import {setScrollPosition} from '../redux/yourProgressSlice';

const {width} = Dimensions.get('window');

const YourProgress = () => {
  const dispatch = useDispatch();
  const enrichedProgressData = useSelector(selectEnrichedProgressData);

  useEffect(() => {
    if (!enrichedProgressData.length) {
      dispatch(fetchUserProgress());
    }
  }, [dispatch, enrichedProgressData.length]);

  const handleScroll = event => {
    dispatch(setScrollPosition(event.nativeEvent.contentOffset.x));
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <View>
          <CustomText style={styles.title} fontWeight="500">
            Your Progress
          </CustomText>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {enrichedProgressData.map((progress, index) => (
          <YourProgressSingle
            key={progress.progressId || `progress-${index}`}
            percentage={progress.percentage}
            courseTitle={progress.courseTitle}
            currentLesson={progress.currentLesson}
            totalLessons={progress.courseDetails?.totalLessons}
            primaryCategory={progress.courseDetails?.categories?.primary}
            courseData={progress}
            overallProgress={progress.overallProgress}
            iconColor={progress.iconColor}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    marginLeft: width * 0.125,
    width,
    marginTop: 28,
    minHeight: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingRight: width * 0.125,
  },
});

export default YourProgress;
