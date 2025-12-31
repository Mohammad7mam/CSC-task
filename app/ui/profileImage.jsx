import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux'; // إضافة Redux
import Svg, {Circle} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logoutUser} from '../redux/authSlice'; // استيراد action

const {width, height} = Dimensions.get('window');

const ProfileImage = ({progress = 60, onLogoutComplete}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch(); // استخدام dispatch
  const [loading, setLoading] = useState(false);

  // استخدام useSelector للوصول إلى حالة Redux
  const {isAuthenticated, user} = useSelector(state => state.auth);

  const size = 52;
  const strokeWidth = 1.83;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  // دالة مساعدة لفحص حالة التخزين
  const debugStorage = async stage => {
    try {
      console.log(`🔍 [${stage}] فحص حالة AsyncStorage:`);
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('   جميع المفاتيح:', allKeys);

      for (const key of allKeys) {
        const value = await AsyncStorage.getItem(key);
        const shortValue = value
          ? value.length > 50
            ? value.substring(0, 50) + '...'
            : value
          : 'null';
        console.log(`   ${key}: ${shortValue}`);
      }
    } catch (error) {
      console.error(`❌ خطأ في فحص التخزين [${stage}]:`, error);
    }
  };

  // دالة الانتقال إلى Onboarding
  const navigateToOnboarding = () => {
    console.log('📍 الانتقال إلى شاشة Onboarding');

    // إعادة تعيين شاشة التنقل
    navigation.reset({
      index: 0,
      routes: [{name: 'Onboarding'}],
    });
  };

  const handleLogout = async () => {
    setLoading(true);
    console.log('🚪 ===== بدء عملية تسجيل الخروج =====');
    console.log('👤 حالة المستخدم قبل تسجيل الخروج:', {
      isAuthenticated,
      userEmail: user?.email,
    });

    try {
      // 1. فحص حالة التخزين قبل التسجيل الخروج
      await debugStorage('قبل تسجيل الخروج');

      // 2. إرسال action تسجيل الخروج إلى Redux
      console.log('📡 إرسال logoutUser action إلى Redux...');
      const logoutAction = await dispatch(logoutUser());
      console.log('✅ نتيجة logout action:', logoutAction);

      // 3. مسح جميع البيانات المحلية الإضافية
      console.log('🗑️ مسح البيانات المحلية الإضافية...');
      const additionalKeys = [
        'firebase_user',
        'user_session',
        'laravel_token',
        'laravel_user',
      ];

      for (const key of additionalKeys) {
        try {
          await AsyncStorage.removeItem(key);
          console.log(`   تم مسح ${key}`);
        } catch (error) {
          console.log(`   ⚠️ ${key}: ${error.message}`);
        }
      }

      // 4. التحقق من حالة التخزين بعد المسح
      await debugStorage('بعد تسجيل الخروج');

      // 5. التحقق النهائي من تسجيل الخروج
      const tokenExists = await AsyncStorage.getItem('auth_token');
      const userExists = await AsyncStorage.getItem('current_user');

      if (!tokenExists && !userExists) {
        console.log('✅ ✅ ✅ تسجيل الخروج مكتمل بنجاح');

        // إرسال إشعار للمكون الأب إذا كان موجوداً
        if (onLogoutComplete) {
          console.log('📢 إرسال إشعار onLogoutComplete');
          onLogoutComplete();
        }

        // الانتقال إلى Onboarding
        setTimeout(() => {
          console.log('🚀 الانتقال إلى Onboarding...');
          navigateToOnboarding();
        }, 300);

        // إظهار رسالة نجاح
        Alert.alert('تم تسجيل الخروج', 'تم تسجيل خروجك بنجاح', [
          {
            text: 'حسناً',
            onPress: () => {
              console.log('👆 المستخدم ضغط على حسناً');
              navigateToOnboarding();
            },
          },
        ]);
      } else {
        console.warn('⚠️ لا يزال هناك بيانات متبقية:', {
          tokenExists: !!tokenExists,
          userExists: !!userExists,
        });

        // محاولة مرة أخرى
        if (tokenExists) await AsyncStorage.removeItem('auth_token');
        if (userExists) await AsyncStorage.removeItem('current_user');

        // الانتقال على أي حال
        Alert.alert(
          'تم تسجيل الخروج جزئياً',
          'سيتم إعادة توجيهك إلى شاشة البداية',
          [
            {
              text: 'حسناً',
              onPress: () => navigateToOnboarding(),
            },
          ],
        );

        if (onLogoutComplete) onLogoutComplete();
        setTimeout(() => navigateToOnboarding(), 300);
      }
    } catch (error) {
      console.error('❌ ❌ ❌ خطأ في تسجيل الخروج:', error);

      // محاولة التعافي من الخطأ
      try {
        console.log('🔄 محاولة التعافي من الخطأ...');

        // مسح جميع المفاتيح المحتملة
        const allKeys = await AsyncStorage.getAllKeys();
        console.log('🔑 محاولة مسح جميع المفاتيح:', allKeys);

        const userRelatedKeys = allKeys.filter(
          key =>
            key.includes('auth') ||
            key.includes('user') ||
            key.includes('token') ||
            key.includes('session'),
        );

        if (userRelatedKeys.length > 0) {
          await AsyncStorage.multiRemove(userRelatedKeys);
          console.log(
            '🗑️ تم مسح المفاتيح المتعلقة بالمستخدم:',
            userRelatedKeys,
          );
        }

        // التحقق النهائي
        const remainingKeys = await AsyncStorage.getAllKeys();
        const remainingUserKeys = remainingKeys.filter(
          key =>
            key.includes('auth') ||
            key.includes('user') ||
            key.includes('token'),
        );

        if (remainingUserKeys.length === 0) {
          console.log('✅ تم استعادة الحالة بنجاح');
        } else {
          console.warn('⚠️ لا يزال هناك مفاتيح متبقية:', remainingUserKeys);
        }

        // إظهار رسالة
        Alert.alert('انتهت الجلسة', 'سيتم إعادة توجيهك إلى شاشة البداية', [
          {
            text: 'حسناً',
            onPress: () => navigateToOnboarding(),
          },
        ]);

        if (onLogoutComplete) onLogoutComplete();
        setTimeout(() => navigateToOnboarding(), 300);
      } catch (recoveryError) {
        console.error('❌ فشل في التعافي:', recoveryError);

        // الانتقال على أي حال
        Alert.alert('انتهت الجلسة', 'سيتم إعادة توجيهك', [
          {
            text: 'حسناً',
            onPress: () => navigateToOnboarding(),
          },
        ]);

        if (onLogoutComplete) onLogoutComplete();
        setTimeout(() => navigateToOnboarding(), 300);
      }
    } finally {
      console.log('🏁 انتهت عملية تسجيل الخروج');
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (loading) return;

    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
          onPress: () => console.log('إلغاء تسجيل الخروج'),
        },
        {
          text: loading ? 'جاري...' : 'تسجيل الخروج',
          onPress: () => {
            console.log('✅ تأكيد تسجيل الخروج');
            handleLogout();
          },
          style: 'destructive',
          disabled: loading,
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.7}>
      <View style={styles.circleContainer}>
        {/* مؤشر التحميل */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#FD432E" size="small" />
            <Text style={styles.loadingText}>جاري...</Text>
          </View>
        )}

        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E3E3E3"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FD432E"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        <Image
          source={require('../assets/pngs/1684129604f822d67ea82ae9557b49d491ec7b02.jpg')}
          style={[styles.profileImage, loading && styles.profileImageDisabled]}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    position: 'absolute',
    width: 42.845,
    height: 42.845,
    borderRadius: 21.4225,
  },
  profileImageDisabled: {
    opacity: 0.5,
  },
  loadingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    fontSize: 10,
    color: '#FD432E',
    marginTop: 4,
  },
});

export default ProfileImage;
