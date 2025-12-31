import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import DateHeader from './DateHeader';
import WeeklyCalendar from './WeeklyCalendar';


const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const WeeklyCalen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {/* الفيو الكبير */}
        <View style={styles.mainContainer}>
          
          {/* 1. العنصر العلوي */}
          <DateHeader />

          {/* إذا كنت تريد مسافة مرنة تدفع التقويم للأسفل، 
             يمكنك إزالة العنصر الثالث وترك justifyContent: 'space-between' 
          */}

          {/* 2. التقويم في الأسفل تماماً */}
          <WeeklyCalendar />

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight * 0.34,
    backgroundColor: '#1F1F1F',
    // justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  mainContainer: {
    width: screenWidth * 0.925,
    height: screenHeight * 0.2259, // الارتفاع الثابت
    alignItems: 'center',
    // 'space-between' تضع العنصر الأول في الأعلى والأخير في الأسفل تماماً
    justifyContent: 'space-between', 
    paddingBottom: 0, // تأكد من عدم وجود padding سفلي ليلتصق التقويم بالطرف
            // backgroundColor: '#ff0000ff',

  },
});

export default WeeklyCalen;