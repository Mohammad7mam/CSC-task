import React, {useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Dots from '../assets/svgs/Dots';
import LessonCard2 from '../ui/LessonCard2';
import {incrementClickCount} from '../redux/yourProgressSingleSlice';
import {selectCardInteractions} from '../redux/progressSelectors';

const {width: screenWidth} = Dimensions.get('window');
const CONTAINER_WIDTH = screenWidth * 0.66;
const {width} = Dimensions.get('window');
const MAIN_CONTAINER_WIDTH = width * 0.66;

const YourProgressSingle = ({
  percentage = 0, // هذا سيتم تجاهله الآن
  courseTitle = 'Unknown Course',
  currentLesson = 1,
  totalLessons = 0,
  primaryCategory = '',
  courseData = {},
  iconColor = '#000',
}) => {
  const dispatch = useDispatch();
  const interactions =
    useSelector(selectCardInteractions)[courseData.progressId] || {};

  useEffect(() => {
    // تسجيل تفاعل البطاقة
    if (courseData.progressId) {
      dispatch(incrementClickCount(courseData.progressId));
    }
  }, [courseData.progressId, dispatch]);

  const handleDotsPress = () => {
    console.log('Dots pressed for:', courseData.progressId);
  };

  // الحصول على overallProgress من courseData
  const overallProgress = courseData.overallProgress || 0;

  // إذا كان overallProgress ليس رقماً، نستخدم القيمة الافتراضية 0
  const progressValue =
    typeof overallProgress === 'number' ? overallProgress : 0;

  // حساب percentage من overallProgress
  const calculatedPercentage = Math.min(100, Math.max(0, progressValue));

  // حساب عدد الدروس المكتملة بناءً على overallProgress
  const completedLessons = Math.round((progressValue / 100) * totalLessons);

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        {/* الفيو الرمادي */}
        <View style={styles.grayView}>
          <LessonCard2
            style={styles.lessonCardPosition}
            courseTitle={courseTitle}
            currentLesson={completedLessons} // استخدام عدد الدروس المكتملة
            totalLessons={totalLessons}
            primaryCategory={primaryCategory}
            iconColor={iconColor}
            interactions={interactions}
          />
        </View>

        {/* زر النقاط */}
        <TouchableOpacity style={styles.dotsButton} onPress={handleDotsPress}>
          <Dots />
        </TouchableOpacity>
      </View>
      <View style={styles.mainContainer}>
        {/* شريط التقدم */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {width: `${calculatedPercentage}%`},
            ]}
          />
        </View>

        {/* النص */}
        <Text style={styles.progressText}>
          Course Completed {calculatedPercentage}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#1F1F1F',
    height: 116.94424438476562,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.7,
    paddingVertical: 16,
    gap: 12,
    borderRadius: 8,
    marginRight: 14,
  },
  container: {
    width: CONTAINER_WIDTH,
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  grayView: {
    flex: 1,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  lessonCardPosition: {
    backgroundColor: 'transparent',
    paddingLeft: 0,
    marginLeft: 0,
    flex: 1,
    width: '100%',
  },
  dotsButton: {
    height: 50,
    justifyContent: 'flex-start',
    paddingTop: 5,
  },
  mainContainer: {
    width: MAIN_CONTAINER_WIDTH,
    height: 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  progressBarBackground: {
    height: 5,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4E4E4E',
    borderRadius: 5,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 13,
  },
});

export default YourProgressSingle;
