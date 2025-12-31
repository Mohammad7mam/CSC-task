// ui/LessonCard.js
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomText from '../Fonts/CustomText';

// استيراد مكتبة الأيقونات
import AdvanceTypography from '../assets/svgs/categories/AdvanceTypography';
import Design from '../assets/svgs/categories/Design';
import DesignDevelopment from '../assets/svgs/categories/DesignDevelopment';
import WebDevelopment from '../assets/svgs/categories/WebDevelopment';
import Fundamental from '../assets/svgs/categories/Fundamental';

// Redux imports
import {setIconColor} from '../redux/lessonCardSlice';
import {selectIconPreferences} from '../redux/progressSelectors';

// مكتبة الأيقونات مرتبطة بـ categoryId (مثل المثال الأول)
const iconLibrary = {
  advance_typography: AdvanceTypography,
  design: Design,
  design_development: DesignDevelopment,
  fundamental_of_designing: Fundamental,
  web_development: WebDevelopment,
  // القيم الافتراضية بناء على primary category من Firebase
  'Web Development': WebDevelopment,
  Design: Design,
  'Advance Typography': AdvanceTypography,
  'Design Development': DesignDevelopment,
  Fundamental: Fundamental,
};

// مكتبة الألوان المرتبطة بـ categoryId (مثل المثال الأول)
const colorLibrary = {
  advance_typography: '#7D323C',
  design: '#FFC2BB',
  design_development: '#CCF5E1',
  fundamental_of_designing: '#0E4A22',
  web_development: '#FFCCF5',
  // القيم الافتراضية بناء على primary category
  'Web Development': '#FFCCF5',
  Design: '#FFD6CC',
  'Advance Typography': '#7D323C',
  'Design Development': '#FFCCF5',
  Fundamental: '#0E4A22',
};

// دالة للحصول على الأيقونة المناسبة
const getCategoryIcon = primaryCategory => {
  if (!primaryCategory) return WebDevelopment; // قيمة افتراضية

  // تحويل الاسم إلى مفتاح مناسب
  const key = primaryCategory.toLowerCase().replace(/\s+/g, '_');

  // البحث في المكتبة
  const IconComponent =
    iconLibrary[key] || iconLibrary[primaryCategory] || WebDevelopment;
  return IconComponent;
};

// دالة للحصول على اللون المناسب
const getCategoryColor = primaryCategory => {
  if (!primaryCategory) return '#D4CCFC'; // لون افتراضي

  // تحويل الاسم إلى مفتاح مناسب
  const key = primaryCategory.toLowerCase().replace(/\s+/g, '_');

  // البحث في المكتبة
  const color = colorLibrary[key] || colorLibrary[primaryCategory] || '#D4CCFC';
  return color;
};

const LessonCard = ({
  style,
  courseTitle = 'Unknown Course',
  currentLesson = 1,
  totalLessons = 0,
  primaryCategory = 'Web Development',
  // إزالة iconColor من الـ props لأنه سيتم تحديده تلقائياً

  interactions = {},
}) => {
  const dispatch = useDispatch();
  const iconPreferences = useSelector(selectIconPreferences);

  const IconComponent = getCategoryIcon(primaryCategory);
  const defaultColor = getCategoryColor(primaryCategory);

  const lessonText = `${currentLesson} ${
    totalLessons > 0 ? `/ ${totalLessons}` : ''
  } Video${currentLesson !== 1 ? 's' : ''}`;

  useEffect(() => {
    // حفظ تفضيلات الأيقونة إذا كانت مختلفة أو غير موجودة
    const savedColor = iconPreferences[primaryCategory]?.color;
    if (!savedColor) {
      // إذا لم يكن هناك لون محفوظ لهذا الكورس، احفظ اللون الافتراضي
      dispatch(setIconColor({category: primaryCategory, color: defaultColor}));
    }
  }, [primaryCategory, defaultColor, dispatch, iconPreferences]);

  // استخدام اللون المحفوظ أو اللون الافتراضي
  const displayColor = iconPreferences[primaryCategory]?.color || defaultColor;

  return (
    <View style={[styles.container, style]}>
      {/* الـ View الأيسر: الأيقونة مع اللون الخلفي */}
      <View style={[styles.iconContainer, {backgroundColor: displayColor}]}>
        <IconComponent
          color="#000" // استخدام اللون الأبيض للأيقونة نفسها مثل المثال الأول
        />
      </View>

      {/* الـ View الأيمن: النصوص */}
      <View style={styles.textContainer}>
        <View style={styles.textUp}>
          <CustomText fontWeight="600" style={styles.title} numberOfLines={1}>
            {courseTitle}
          </CustomText>
        </View>
        <View style={styles.textDn}>
          <CustomText fontWeight="600" style={styles.subtitle}>
            {lessonText}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 0,
    height: 50,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    color: 'white',
  },
  textUp: {
    height: 22,
    justifyContent: 'center',
  },
  textDn: {
    height: 18,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
  },
  clickCount: {
    fontSize: 9,
    color: '#888',
    marginTop: 2,
  },
});

export default LessonCard;
