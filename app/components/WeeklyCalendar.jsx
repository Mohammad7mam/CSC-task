import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// الحسابات الرياضية
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.875;
const GAP = 2;
const TOTAL_GAPS_WIDTH = GAP * 6; // 6 فواصل بين 7 عناصر
const AVAILABLE_WIDTH = CONTAINER_WIDTH - TOTAL_GAPS_WIDTH;

// المعادلة: 6 * W + (1.166 * W) = AVAILABLE_WIDTH
// W (7.166) = AVAILABLE_WIDTH
const UNSELECTED_WIDTH = AVAILABLE_WIDTH / 7.166;
const SELECTED_WIDTH = UNSELECTED_WIDTH * 1.166;

const WeeklyCalendar = () => {
  const [selectedDay, setSelectedDay] = useState(null); // سيكون null حتى نحسبه
  const [days, setDays] = useState([]);

  // أسماء الأيام بالإنجليزية - من الاثنين إلى الأحد
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // دالة لإنشاء الأيام السبعة بناءً على التاريخ الحالي (UTC)
  const generateWeekDays = () => {
    const today = new Date();
    
    // استخدام التوقيت العالمي
    const utcYear = today.getUTCFullYear();
    const utcMonth = today.getUTCMonth();
    const utcDate = today.getUTCDate();
    const utcDay = today.getUTCDay(); // 0 (الأحد) إلى 6 (السبت)
    
    // إنشاء تاريخ UTC
    const utcToday = new Date(Date.UTC(utcYear, utcMonth, utcDate));
    
    // حساب يوم الاثنين من الأسبوع الحالي (بداية الأسبوع)
    // في UTC: 0=الأحد, 1=الاثنين, 2=الثلاثاء, ..., 6=السبت
    const monday = new Date(utcToday);
    
    // إذا كان اليوم الأحد (0) في UTC، نرجع 6 أيام للخلف
    // إذا كان اليوم الاثنين (1) في UTC، فهو بداية الأسبوع
    // إذا كان اليوم الثلاثاء (2) في UTC، نرجع يوم واحد للخلف
    // وهكذا...
    const daysToSubtract = utcDay === 0 ? 6 : utcDay - 1;
    monday.setUTCDate(utcToday.getUTCDate() - daysToSubtract);
    
    const weekDays = [];
    let todayIndex = -1; // لتحديد موقع اليوم الحالي في المصفوفة
    
    // إنشاء الأيام السبعة ابتداءً من الاثنين
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setUTCDate(monday.getUTCDate() + i);
      
      // التحقق إذا كان هذا اليوم هو اليوم الحالي
      const isToday = 
        date.getUTCFullYear() === utcToday.getUTCFullYear() &&
        date.getUTCMonth() === utcToday.getUTCMonth() &&
        date.getUTCDate() === utcToday.getUTCDate();
      
      if (isToday) {
        todayIndex = i;
      }
      
      weekDays.push({
        day: dayNames[i], // استخدام ترتيب المصفوفة من الاثنين إلى الأحد
        date: date.getUTCDate().toString().padStart(2, '0'),
        fullDate: date,
        isToday: isToday,
      });
    }
    
    setDays(weekDays);
    
    // إذا كان اليوم الحالي ضمن الأسبوع، نحدده
    if (todayIndex !== -1) {
      setSelectedDay(todayIndex);
    }
  };

  useEffect(() => {
    generateWeekDays();
  }, []);

  return (
    <View style={styles.mainContainer}>
      {days.map((item, index) => {
        const isSelected = index === selectedDay;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {}} // لا تفعل شيئاً لمنع تغيير التاريخ
            activeOpacity={1} // لا تأثير عند الضغط
            style={[
              styles.dayBox,
              isSelected ? styles.selectedBox : styles.unselectedBox,
            ]}>
            <Text style={styles.dayText}>{item.day}</Text>
            <Text style={styles.dateText}>{item.date}</Text>

            {/* المؤشر الإضافي للمكون المحدد فقط */}
            {isSelected && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: CONTAINER_WIDTH,
    height: 87,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayBox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  unselectedBox: {
    width: UNSELECTED_WIDTH,
    height: 57,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  selectedBox: {
    width: SELECTED_WIDTH,
    height: 87,
    padding: 14,
    backgroundColor: '#333',
    borderRadius: 8,
    gap: 6,
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  indicator: {
    width: 7.44,
    height: 7.44,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
    marginTop: 2,
  },
});

export default WeeklyCalendar;