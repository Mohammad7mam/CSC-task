import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ButtonWithDetails = ({
  text = 'Enroll in this course',
  notificationMessage = 'مرحبًا بك في دورة React Native!',
  notificationTitle = 'Home',
  courseId,
  course, // ✅ هذا هو الكورس الكامل من DetailScreen
  onPress,
  ...props
}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // دالة لإنشاء ID فريد للتسجيل
  const generateEnrollmentId = () => {
    return (
      'enrollment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  };

  // دالة لحفظ التسجيل في Firebase
  const saveEnrollmentToFirebase = async enrollmentData => {
    try {
      const enrollmentId = generateEnrollmentId();
      const firebaseUrl = `https://tst-csc-default-rtdb.firebaseio.com/course_enrollments/${enrollmentId}.json`;

      const response = await fetch(firebaseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to save enrollment to Firebase');
      }

      const result = await response.json();
      console.log('✅ Enrollment saved successfully:', enrollmentId);
      console.log('📊 Course data in enrollment:', {
        hasCourseData: !!enrollmentData.courseData,
        title: enrollmentData.courseTitle,
        courseId: enrollmentData.courseId,
      });

      return enrollmentId;
    } catch (error) {
      console.error('❌ Error saving enrollment:', error);
      throw error;
    }
  };

  // دالة التعامل مع النقر
  const handlePress = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // 1. التحقق من وجود بيانات المستخدم
      const userJson = await AsyncStorage.getItem('current_user');
      if (!userJson) {
        Alert.alert(
          'تسجيل الدخول مطلوب',
          'يجب عليك تسجيل الدخول أولاً للتسجيل في الكورس',
          [{text: 'حسناً', onPress: () => navigation.navigate('Login')}],
        );
        return;
      }

      const user = JSON.parse(userJson);

      // 2. التحقق من وجود بيانات الكورس
      if (!course && !courseId) {
        Alert.alert('خطأ', 'بيانات الكورس غير متوفرة');
        return;
      }

      // 3. ✅ استخدم بيانات الكورس الكاملة إذا كانت متاحة
      const fullCourseData = course || {};

      // 4. بناء كائن التسجيل مع بيانات الكورس الكاملة
      const enrollmentData = {
        enrollmentId: generateEnrollmentId(),
        courseId: courseId || fullCourseData.courseId || `course_${Date.now()}`,
        courseTitle: fullCourseData.title || 'Unknown Course',
        // ✅ حفظ بيانات الكورس كاملة لتستخدمها ProgressService لاحقاً
        courseData: fullCourseData, // هذا هو الأهم!

        instructorId:
          fullCourseData.instructor?.instructorId || 'instructor_unknown',
        instructorName: fullCourseData.instructor?.name || 'Unknown Instructor',
        message: 'I want to enroll in this course to improve my skills',

        // ✅ استخدام البيانات الحقيقية للكورس
        price: fullCourseData.price || {
          amount: 0,
          currency: 'USD',
          discountPercentage: 0,
        },

        requestDate: new Date().toISOString(),
        status: 'pending',
        userEmail: user.email || 'unknown@email.com',
        userId: user.uid || user.id || `user_${Date.now()}`,
        userName:
          user.fullName || user.firstName || user.name || 'Unknown User',

        // ✅ إضافة معلومات إضافية مفيدة
        courseCategories: fullCourseData.categories || {
          primary: 'Uncategorized',
          secondary: [],
          tags: [],
        },
        totalLessons: fullCourseData.totalLessons || 0,
        totalWeeks: fullCourseData.totalWeeks || 0,
        totalHours: fullCourseData.totalHours || 0,
      };

      console.log('📝 Enrollment data saved to Firebase:', {
        title: enrollmentData.courseTitle,
        hasFullCourseData: !!enrollmentData.courseData,
        courseDataKeys: enrollmentData.courseData
          ? Object.keys(enrollmentData.courseData)
          : [],
        categories: enrollmentData.courseCategories,
      });

      // 5. حفظ في Firebase
      const enrollmentId = await saveEnrollmentToFirebase(enrollmentData);

      // 6. عرض رسالة نجاح
      Alert.alert(
        'تم التسجيل في الكورس بنجاح',
        `تم إرسال طلب تسجيلك في كورس "${enrollmentData.courseTitle}" بنجاح.`,
        [
          {
            text: 'الذهاب إلى الصفحة الرئيسية',
            onPress: () => {
              navigation.navigate('Home', {
                notificationMessage: `تم تسجيلك في كورس "${enrollmentData.courseTitle}" بنجاح!`,
                notificationTitle: 'تم التسجيل',
                enrollmentId: enrollmentId,
              });
            },
          },
          {
            text: 'البقاء هنا',
            style: 'cancel',
          },
        ],
      );

      // 7. استدعاء الدالة الممررة عبر props إن وجدت
      if (onPress) {
        onPress(enrollmentId, enrollmentData);
      }
    } catch (error) {
      console.error('❌ Error in enrollment:', error);
      Alert.alert(
        'خطأ في التسجيل',
        'حدث خطأ أثناء محاولة التسجيل في الكورس. الرجاء المحاولة مرة أخرى.',
        [{text: 'حسناً'}],
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={loading}
      {...props}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const {width} = Dimensions.get('window');
const buttonWidth = width * 0.9;

const styles = StyleSheet.create({
  button: {
    width: buttonWidth,
    height: 67,
    backgroundColor: '#7C6AF1',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#9E91F5',
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default ButtonWithDetails;
