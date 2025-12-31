import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  StatusBar,
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import DetailScreen from '../screens/DetailScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminEnrollments from '../screens/AdminEnrollments';
import OnboardingLoding from '../Loading/OnboardingLoding';

import CustomBottomBar from '../components/BottomBar';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('Welcome');
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // حالة لتخزين نوع المستخدم

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. تغيير لون شريط التنقل (إذا كان أندرويد)
        if (Platform.OS === 'android') {
          await changeNavigationBarColor('#161616', false, true);
        }

        // 2. التحقق من حالة تسجيل الدخول ونوع المستخدم
        await checkLoginStatus();
      } catch (error) {
        console.log('Error initializing app:', error);
        setInitialRoute('Onboarding');
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // دالة للتحقق من حالة تسجيل الدخول ونوع المستخدم
  const checkLoginStatus = async () => {
    try {
      // التحقق من وجود token وبيانات المستخدم
      const authToken = await AsyncStorage.getItem('auth_token');
      const currentUser = await AsyncStorage.getItem('current_user');

      console.log('🔍 فحص حالة تسجيل الدخول:');
      console.log('- auth_token:', authToken ? 'موجود' : 'غير موجود');
      console.log('- current_user:', currentUser ? 'موجود' : 'غير موجود');

      if (authToken && currentUser) {
        // ✅ المستخدم مسجل دخول
        const userData = JSON.parse(currentUser);
        const userType = userData.userType || 'student'; // الافتراضي student

        console.log(
          '✅ المستخدم مسجل دخول:',
          userData.firstName || userData.email,
          '- نوع المستخدم:',
          userType,
        );

        setIsLoggedIn(true);
        setUserType(userType);

        // 🔄 تحديد الشاشة الأولى بناءً على نوع المستخدم
        if (userType === 'admin') {
          setInitialRoute('AdminEnrollments'); // Admin يذهب مباشرة إلى لوحة التحكم
        } else {
          setInitialRoute('Home'); // Student يذهب إلى الصفحة الرئيسية
        }
      } else {
        // ❌ المستخدم غير مسجل دخول
        console.log('❌ المستخدم غير مسجل دخول');
        setIsLoggedIn(false);
        setUserType(null);
        setInitialRoute('Onboarding');
      }
    } catch (error) {
      console.error('❌ خطأ في التحقق من حالة تسجيل الدخول:', error);
      setIsLoggedIn(false);
      setUserType(null);
      setInitialRoute('Onboarding');
    } finally {
      setLoading(false);
    }
  };

  // دالة لمعالجة تسجيل الدخول الناجح
  const handleLoginSuccess = userData => {
    setIsLoggedIn(true);
    const userType = userData?.userType || 'student';
    setUserType(userType);

    // تحديد الوجهة بعد تسجيل الدخول بناءً على نوع المستخدم
    if (userType === 'admin') {
      setInitialRoute('AdminEnrollments');
    } else {
      setInitialRoute('Home');
    }
  };

  // دالة لمعالجة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'current_user']);
      setIsLoggedIn(false);
      setUserType(null);
      setInitialRoute('Onboarding');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // تحديث حالة التنقل عند تغيير الشاشة
  useEffect(() => {
    if (!loading && initialRoute && isLoggedIn) {
      console.log(
        '📍 الشاشة الابتدائية:',
        initialRoute,
        '- نوع المستخدم:',
        userType,
      );
    }
  }, [loading, initialRoute, isLoggedIn, userType]);

  // عرض مؤشر التحميل
  if (loading || initialRoute === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C6AF1" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  // تحديد الشاشات التي تظهر فيها البار السفلي
  // لا نعرض البار السفلي في شاشة AdminEnrollments
  const showBottomBarOn = ['Home', 'Progress', 'Detail'];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#161616" barStyle="light-content" />

      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#161616'},
        }}
        screenListeners={{
          state: e => {
            const routeName = e.data.state.routes[e.data.state.index].name;
            setCurrentRoute(routeName);

            // تحديث حالة المستخدم عند التنقل
            if (routeName !== currentRoute) {
              updateUserStatus();
            }
          },
        }}>
        {/* شاشة التعريف (Onboarding) - للمستخدمين الجدد */}
        <Stack.Screen name="Onboarding">
          {props => (
            <OnboardingScreen
              {...props}
              onGetStarted={() => {
                props.navigation.navigate('Login');
              }}
            />
          )}
        </Stack.Screen>

        {/* شاشة تسجيل الدخول */}
        <Stack.Screen name="Login">
          {props => (
            <LoginScreen
              {...props}
              onLoginSuccess={userData => {
                handleLoginSuccess(userData);
                // بعد تسجيل الدخول الناجح، انتقل للشاشة المناسبة
                if (userData?.userType === 'admin') {
                  props.navigation.navigate('AdminEnrollments');
                } else {
                  props.navigation.navigate('Home');
                }
              }}
              onLogout={handleLogout}
            />
          )}
        </Stack.Screen>

        {/* شاشات الطلاب (Students) */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="OnboardingLoding" component={OnboardingLoding} />

        {/* شاشة المسؤولين (Admins) */}
        <Stack.Screen
          name="AdminEnrollments"
          component={AdminEnrollments}
          options={{
            headerShown: true,
            headerTitle: 'Admain Dashboard',
            headerStyle: {
              backgroundColor: '#161616',
            },
            headerTintColor: '#FFFFFF',
            headerBackTitle: 'خروج',
            // إخفاء زر الرجوع للـ admin حتى لا يرجع لـ Onboarding
            headerBackVisible: false,
          }}
        />

        {/* شاشات إضافية يمكن للمسؤول الوصول إليها */}
        <Stack.Screen
          name="AdminDashboard"
          component={AdminEnrollments}
          options={{
            headerShown: true,
            headerTitle: 'لوحة التحكم',
            headerStyle: {backgroundColor: '#161616'},
            headerTintColor: '#FFFFFF',
          }}
        />
      </Stack.Navigator>

      {/* إظهار البار السفلي فقط في الشاشات المحددة */}
      {/* لا نعرضه في شاشات Admin */}
      {showBottomBarOn.includes(currentRoute) && <CustomBottomBar />}
    </View>
  );
}

// دالة لتحديث حالة المستخدم عند التنقل بين الشاشات
const updateUserStatus = async () => {
  try {
    const currentUser = await AsyncStorage.getItem('current_user');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      console.log('👤 حالة المستخدم الحالي:', {
        name: userData.fullName || userData.firstName,
        type: userData.userType || 'student',
        email: userData.email,
      });
    }
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161616',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 15,
    fontSize: 16,
  },
});

export default AppNavigator;
