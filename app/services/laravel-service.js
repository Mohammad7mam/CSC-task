import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_IP = '192.168.1.98';
const BASE_URL = `http://${LOCAL_IP}:8000/api/v1`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 1500000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// محور الطلبات
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('laravel_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('خطأ في جلب التوكن:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالج الاستجابات
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Interceptor error:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      // ⭐⭐ نفس الوجيك: مسح التوكنات عند 401 ⭐⭐
      await AsyncStorage.removeItem('laravel_token');
      await AsyncStorage.removeItem('laravel_user');
    }
    return Promise.reject(error);
  }
);

class LaravelService {
  constructor() {
    console.log('LaravelService initialized with URL:', BASE_URL);
  }

  // ⭐⭐ تطبيع البيانات - مطابق للـ Firebase ⭐⭐
  normalizeUserData(laravelUser, userData = null) {
    let firstName = laravelUser.firstName || laravelUser.first_name || '';
    let lastName = laravelUser.lastName || laravelUser.last_name || '';
    
    if ((!firstName || !lastName) && laravelUser.displayName) {
      const names = laravelUser.displayName.split(' ');
      if (names.length > 0) {
        firstName = names[0] || '';
        lastName = names.slice(1).join(' ') || '';
      }
    }
    
    if (userData) {
      firstName = userData.firstName || userData.first_name || firstName;
      lastName = userData.lastName || userData.last_name || lastName;
    }
    
    // ⭐⭐ الهيكل المطابق تماماً للـ Firebase ⭐⭐
    return {
      uid: laravelUser.uid || laravelUser.id || `user_${Date.now()}`,
      email: laravelUser.email || (userData ? userData.email : ''),
      firstName: firstName,
      lastName: lastName,
      fullName: laravelUser.displayName || laravelUser.fullName || `${firstName} ${lastName}`.trim(),
      userType: laravelUser.userType || (userData ? userData.userType : 'student'),
      createdAt: laravelUser.createdAt || new Date().toISOString(),
      displayName: laravelUser.displayName,
      ...laravelUser
    };
  }

  // ⭐⭐ 1. تسجيل مستخدم جديد - نفس الوجيك ⭐⭐
  async register(userData) {
    try {
      console.log('🚀 [Laravel] محاولة تسجيل مستخدم جديد:', userData);

      const {email, password, firstName, lastName} = userData;

      // نفس التحقق من البيانات
      if (!email || !password || !firstName || !lastName) {
        throw {
          success: false,
          message: 'جميع الحقول مطلوبة',
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw {
          success: false,
          message: 'البريد الإلكتروني غير صالح',
        };
      }

      if (password.length < 6) {
        throw {
          success: false,
          message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        };
      }

      const emailLowerCase = email.trim().toLowerCase();
      
      // ⭐⭐ إرسال طلب التسجيل للخادم ⭐⭐
      console.log('📡 إرسال طلب التسجيل للخادم...');
      const response = await api.post('/auth/register', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: emailLowerCase,
        password: password,
        userType: userData.userType || 'student'
      });
      
      console.log('✅ استجابة التسجيل:', response.data);
      
      if (response.data.success && response.data.token) {
        const token = response.data.token;
        
        // ⭐⭐ نفس الوجيك: تحويل البيانات ⭐⭐
        const laravelUser = response.data.user || {};
        const normalizedUser = this.normalizeUserData(laravelUser, userData);
        
        // إضافة التوكن
        normalizedUser.token = token;
        
        // ⭐⭐ نفس الوجيك: حفظ في AsyncStorage ⭐⭐
        await AsyncStorage.setItem('laravel_token', token);
        await AsyncStorage.setItem('laravel_user', JSON.stringify(normalizedUser));

        console.log('✅ تم التسجيل بنجاح:', normalizedUser);

        return {
          success: true,
          message: response.data.message || 'تم إنشاء الحساب بنجاح',
          user: normalizedUser,
          token: token,
        };
      } else {
        throw {
          success: false,
          message: response.data.message || 'فشل التسجيل'
        };
      }
      
    } catch (error) {
      console.error('❌ خطأ في التسجيل:', error);

      return {
        success: false,
        message: error.message || 'حدث خطأ أثناء التسجيل',
        error: error,
      };
    }
  }

  // ⭐⭐ 2. تسجيل الدخول - نفس الوجيك ⭐⭐
  async login(email, password) {
    try {
      console.log('🔐 [Laravel] محاولة تسجيل الدخول:', { email, password });

      if (!email || !password) {
        throw {
          success: false,
          message: 'البريد الإلكتروني وكلمة المرور مطلوبان',
        };
      }

      const emailLowerCase = email.trim().toLowerCase();
      console.log('🔍 إرسال طلب الدخول للخادم...');
      
      // ⭐⭐ إرسال طلب الدخول للخادم ⭐⭐
      const response = await api.post('/auth/login', { 
        email: emailLowerCase, 
        password 
      });
      
      console.log('✅ استجابة الدخول:', response.data);
      
      if (response.data.success && response.data.token) {
        const token = response.data.token;
        
        // ⭐⭐ نفس الوجيك: تحويل البيانات ⭐⭐
        const laravelUser = response.data.user || response.data;
        const normalizedUser = this.normalizeUserData(laravelUser);
        
        // إضافة التوكن
        normalizedUser.token = token;
        
        // ⭐⭐ نفس الوجيك: حفظ في AsyncStorage ⭐⭐
        await AsyncStorage.setItem('laravel_token', token);
        await AsyncStorage.setItem('laravel_user', JSON.stringify(normalizedUser));

        console.log('✅ تم تسجيل الدخول بنجاح:', {
          email: normalizedUser.email,
          uid: normalizedUser.uid,
          userType: normalizedUser.userType,
          fullName: normalizedUser.fullName
        });

        return {
          success: true,
          message: response.data.message || 'تم تسجيل الدخول بنجاح',
          user: normalizedUser,
          token: token,
        };
      } else {
        throw {
          success: false,
          message: response.data.message || 'فشل تسجيل الدخول'
        };
      }
      
    } catch (error) {
      console.error('❌ خطأ في تسجيل الدخول:', error);

      return {
        success: false,
        message: error.message || 'حدث خطأ أثناء تسجيل الدخول',
        error: error,
      };
    }
  }

  // ⭐⭐ 3. تسجيل الخروج - نفس الوجيك بالضبط ⭐⭐
  async logout() {
    try {
      console.log('🚪 [Laravel] بدء تسجيل الخروج...');
      
      // ⭐⭐ 1. محاولة تسجيل الخروج من الخادم ⭐⭐
      try {
        await api.post('/auth/logout');
        console.log('✅ تم تسجيل الخروج من الخادم');
      } catch (serverError) {
        console.log('⚠️ قد يكون المستخدم خارجاً بالفعل:', serverError.message);
        // نستمر في العملية
      }
      
      // ⭐⭐ 2. نفس الوجيك: مسح التوكنات من AsyncStorage ⭐⭐
      await AsyncStorage.removeItem('laravel_token');
      await AsyncStorage.removeItem('laravel_user');
      
      console.log('✅ تم تسجيل الخروج بنجاح');

      return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح',
      };
    } catch (error) {
      console.error('❌ خطأ في تسجيل الخروج:', error);
      
      // ⭐⭐ نفس الوجيك: نرمي الخطأ ⭐⭐
      throw error;
    }
  }

  // ⭐⭐ 4. التحقق من حالة المصادقة - نفس الوجيك ⭐⭐
  async checkAuth() {
    try {
      console.log('🔍 [Laravel] التحقق من حالة المصادقة...');
      
      // ⭐⭐ نفس الوجيك: جلب التوكن والمستخدم ⭐⭐
      const token = await AsyncStorage.getItem('laravel_token');
      const userJson = await AsyncStorage.getItem('laravel_user');

      console.log('📊 بيانات التخزين:', {
        hasToken: !!token,
        hasUser: !!userJson
      });

      if (!token || !userJson) {
        console.log('❌ لا توجد بيانات مصادقة كافية');
        return {
          isAuthenticated: false,
          user: null,
        };
      }

      const user = JSON.parse(userJson);
      
      // ⭐⭐ نفس الوجيك: التحقق من وجود uid ⭐⭐
      if (!user.uid) {
        console.log('❌ لا يوجد uid في بيانات المستخدم');
        // ⭐⭐ نفس الوجيك: ننظف التخزين ⭐⭐
        await this.logout();
        return {
          isAuthenticated: false,
          user: null,
        };
      }

      console.log('👤 التحقق من المستخدم:', user.uid);
      
      // ⭐⭐ محاولة التحقق من الخادم ⭐⭐
      try {
        const response = await api.get('/auth/user');
        console.log('✅ المستخدم مسجل الدخول في الخادم');
        
        return {
          isAuthenticated: true,
          user: user,
        };
      } catch (serverError) {
        console.log('⚠️ التوكن غير صالح أو انتهت الجلسة:', serverError.message);
        
        // ⭐⭐ نفس الوجيك: ننظف التخزين ⭐⭐
        await AsyncStorage.removeItem('laravel_token');
        await AsyncStorage.removeItem('laravel_user');
        
        return {
          isAuthenticated: false,
          user: null,
        };
      }
      
    } catch (error) {
      console.error('❌ خطأ في التحقق من المصادقة:', error);
      
      // ⭐⭐ نفس الوجيك: نرجع false ⭐⭐
      return {
        isAuthenticated: false,
        user: null,
      };
    }
  }

  // ⭐⭐ 5. دالة مساعدة للتحقق من الحالة (اختياري) ⭐⭐
  async checkAuthStatus() {
    return this.checkAuth();
  }

  // ⭐⭐ 6. الحصول على بيانات المستخدم الحالي - نفس الوجيك ⭐⭐
  async getCurrentUser() {
    try {
      const { isAuthenticated, user } = await this.checkAuth();
      
      if (!isAuthenticated) {
        throw {
          success: false,
          message: 'المستخدم غير مسجل الدخول',
        };
      }
      
      // التحقق من الخادم
      try {
        await api.get('/auth/user');
        console.log('✅ المستخدم نشط في الخادم');
      } catch (error) {
        console.log('⚠️ المشكلة في الخادم:', error.message);
        // يمكن التعامل مع الخطأ حسب الحاجة
      }
      
      return {
        success: true,
        user: user,
      };
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات المستخدم:', error);
      throw error;
    }
  }

  // ⭐⭐ 7. دالة للحصول على المستخدم من uid (مشابهة للـ Firebase) ⭐⭐
  async getUserByUid(uid) {
    try {
      console.log(`🔍 البحث عن المستخدم بالـ uid: ${uid}`);
      
      if (!uid) {
        console.log('❌ لا يوجد uid محدد');
        return null;
      }
      
      // محاولة جلب بيانات المستخدم من الخادم
      const response = await api.get(`/auth/user/${uid}`);
      
      if (response.data.success) {
        const user = response.data.user;
        console.log(`✅ تم العثور على المستخدم: ${user.email}`);
        return { userId: uid, ...user };
      } else {
        console.log(`❌ لا يوجد مستخدم بالـ uid: ${uid}`);
        return null;
      }
      
    } catch (error) {
      console.error('❌ خطأ في البحث عن المستخدم:', error);
      return null;
    }
  }

  // 8. فحص اتصال السيرفر
  async checkServerConnection() {
    try {
      console.log('🔍 فحص اتصال السيرفر...');
      
      const startTime = Date.now();
      const response = await axios.get(`${BASE_URL.split('/api')[0]}/test`, {
        timeout: 8000,
        validateStatus: (status) => status < 500
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        connected: true,
        message: '✅ السيرفر متصل ويعمل',
        details: {
          baseUrl: BASE_URL,
          serverResponse: {
            status: response.status,
            responseTime: `${responseTime}ms`
          },
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.log('❌ فشل فحص الاتصال:', error.message);
      
      return {
        success: false,
        connected: false,
        message: '❌ لا يمكن الاتصال بالسيرفر',
        error: error.message,
        baseUrl: BASE_URL
      };
    }
  }
}

export default new LaravelService();