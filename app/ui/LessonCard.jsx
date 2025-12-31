import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomText from '../Fonts/CustomText';

// استيراد جميع أيقونات SVG
import AdvanceTypography from '../assets/svgs/categories/AdvanceTypography';
import Design from '../assets/svgs/categories/Design';
import DesignDevelopment from '../assets/svgs/categories/DesignDevelopment';
import WebDevelopment from '../assets/svgs/categories/WebDevelopment';
import Fundamental from '../assets/svgs/categories/Fundamental';

// مكتبة الأيقونات مرتبطة بـ categoryId
const iconLibrary = {
  // مفتاح: categoryId من Firebase، قيمة: مكون الأيقونة المستورد
  advance_typography: AdvanceTypography,
  design: Design,
  design_development: DesignDevelopment,
  fundamental_of_designing: Fundamental,
  web_development: WebDevelopment,
};

const LessonCard = ({category}) => {
  if (!category) return null;

  const {categoryId, name, totalCourses, color = '#D4CCFC'} = category;

  // الحصول على الأيقونة المناسبة بناءً على categoryId
  const getIconComponent = () => {
    // البحث عن الأيقونة في المكتبة باستخدام categoryId
    const IconComponent = iconLibrary[categoryId];

    if (IconComponent) {
      return IconComponent;
    }

    // إذا لم يتم العثور على أيقونة، نستخدم أيقونة افتراضية
    console.warn(`Icon not found for categoryId: ${categoryId}`);
    return DesignDevelopment; // أيقونة افتراضية
  };

  const IconComponent = getIconComponent();

  return (
    <View style={styles.container}>
      {/* الـ View الأيسر: الأيقونة */}
      <View style={[styles.iconContainer, {backgroundColor: color}]}>
        <IconComponent color="#FFFFFF" />
      </View>

      {/* الـ View الأيمن: النصوص */}
      <View style={styles.textContainer}>
        <View style={styles.textUp}>
          <CustomText fontWeight="600" style={styles.title}>
            {name}
          </CustomText>
        </View>
        <View style={styles.textDn}>
          <Text style={styles.subtitle}>
            {totalCourses} {totalCourses === 1 ? 'Course' : 'Courses'}
          </Text>
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
    padding: 16,
    height: 50,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 45,
  },
  title: {
    fontSize: 16,
    color: 'white',
  },
  textUp: {
    height: 27,
  },
  textDn: {
    height: 18,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: -0.01 * 14,
    color: 'white',
    opacity: 0.8,
  },
});

export default LessonCard;
