import {database} from '../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  // توليد ID فريد للمستخدم
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // دالة مساعدة للحصول على المستخدم مباشرة من uid
  async getUserByUid(uid) {
    try {
      console.log(`🔍 البحث عن المستخدم بالـ uid: ${uid}`);
      
      if (!uid) {
        console.log('❌ لا يوجد uid محدد');
        return null;
      }
      
      const userRef = database().ref(`users/${uid}`);
      const snapshot = await userRef.once('value');
      
      if (!snapshot.exists()) {
        console.log(`❌ لا يوجد مستخدم بالـ uid: ${uid}`);
        return null;
      }
      
      const user = snapshot.val();
      console.log(`✅ تم العثور على المستخدم: ${user.email}`);
      return { userId: uid, ...user };
      
    } catch (error) {
      console.error('❌ خطأ في البحث عن المستخدم:', error);
      return null;
    }
  }

  // دالة مساعدة للبحث الدقيق عن المستخدم بالإيميل (للتسجيل فقط)
  async findUserByEmail(email) {
    try {
      const emailLowerCase = email.trim().toLowerCase();
      console.log(`🔍 البحث عن مستخدم بالإيميل: ${emailLowerCase}`);
      
      const usersRef = database().ref('users');
      const snapshot = await usersRef.once('value');
      
      if (!snapshot.exists()) {
        console.log('❌ لا توجد مستخدمين في قاعدة البيانات');
        return null;
      }
      
      const users = snapshot.val();
      
      // البحث يدوياً في جميع المستخدمين
      for (const userId in users) {
        const user = users[userId];
        const userEmail = user.email ? user.email.trim().toLowerCase() : '';
        
        console.log(`   مقارنة: "${userEmail}" مع "${emailLowerCase}"`);
        
        if (userEmail === emailLowerCase) {
          console.log(`✅ تم العثور على تطابق دقيق: ${userId}`);
          return { userId, ...user };
        }
      }
      
      console.log('❌ لم يتم العثور على مستخدم بهذا الإيميل');
      return null;
      
    } catch (error) {
      console.error('❌ خطأ في البحث عن المستخدم:', error);
      return null;
    }
  }

  // 1. تسجيل مستخدم جديد
  async register(userData) {
    try {
      console.log('🚀 محاولة تسجيل مستخدم جديد:', userData);

      const {email, password, firstName, lastName} = userData;

      // التحقق من البيانات
      if (!email || !password || !firstName || !lastName) {
        throw {
          success: false,
          message: 'جميع الحقول مطلوبة',
        };
      }

      // التحقق من صحة الإيميل
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw {
          success: false,
          message: 'البريد الإلكتروني غير صالح',
        };
      }

      // التحقق من قوة كلمة المرور
      if (password.length < 6) {
        throw {
          success: false,
          message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        };
      }

      const emailLowerCase = email.trim().toLowerCase();
      
      // التحقق إذا كان الإيميل موجود مسبقاً
      const existingUser = await this.findUserByEmail(emailLowerCase);
      if (existingUser) {
        console.log('⚠️ المستخدم موجود مسبقاً:', existingUser);
        throw {
          success: false,
          message: 'البريد الإلكتروني مسجل مسبقاً',
        };
      }

      // توليد ID فريد للمستخدم
      const userId = this.generateUserId();
      const timestamp = new Date().toISOString();

      // إنشاء كائن المستخدم
      const newUser = {
        uid: userId,
        email: emailLowerCase,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        userType: userData.userType || 'student',
        createdAt: timestamp,
        updatedAt: timestamp,
        password: password,
      };

      console.log('📝 بيانات المستخدم الجديد:', newUser);

      // حفظ المستخدم في Firebase باستخدام uid كمفتاح
      await database().ref(`users/${userId}`).set(newUser);

      // إنشاء token محاكاة
      const token = `firebase_token_${userId}_${Date.now()}`;

      // إزالة كلمة المرور قبل تخزين
      const {password: _, ...userWithoutPassword} = newUser;

      // حفظ التوكن وبيانات المستخدم محلياً
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('current_user', JSON.stringify(userWithoutPassword));

      console.log('✅ تم التسجيل بنجاح:', userWithoutPassword);

      return {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: userWithoutPassword,
        token: token,
      };
    } catch (error) {
      console.error('❌ خطأ في التسجيل:', error);

      return {
        success: false,
        message: error.message || 'حدث خطأ أثناء التسجيل',
        error: error,
      };
    }
  }

  // 2. تسجيل الدخول - باستخدام البحث بالإيميل
  async login(email, password) {
    try {
      console.log('🔐 محاولة تسجيل الدخول:', { email, password });

      if (!email || !password) {
        throw {
          success: false,
          message: 'البريد الإلكتروني وكلمة المرور مطلوبان',
        };
      }

      const emailLowerCase = email.trim().toLowerCase();
      console.log('🔍 البحث عن المستخدم بالإيميل:', emailLowerCase);

      // استخدام دالة البحث بالإيميل
      const foundUser = await this.findUserByEmail(emailLowerCase);
      
      if (!foundUser) {
        console.log('❌ لم يتم العثور على مستخدم بهذا الإيميل');
        throw {
          success: false,
          message: 'البريد الإلكتروني غير مسجل',
        };
      }

      const { userId, ...user } = foundUser;
      
      console.log('👤 تم العثور على المستخدم:', {
        userId: userId,
        uid: user.uid,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      // التحقق من كلمة المرور
      console.log(`🔐 التحقق من كلمة المرور:`);
      console.log(`   الإيميل المدخل: ${emailLowerCase}`);
      console.log(`   الإيميل المخزن: ${user.email}`);
      console.log(`   كلمة المرور المدخلة: "${password}"`);
      console.log(`   كلمة المرور المخزنة: "${user.password}"`);
      console.log(`   مقارنة: ${user.password === password ? 'متطابقة' : 'غير متطابقة'}`);

      if (user.password !== password) {
        console.log('❌ كلمة المرور غير صحيحة');
        throw {
          success: false,
          message: 'كلمة المرور غير صحيحة',
        };
      }

      // إنشاء token محاكاة
      const token = `firebase_token_${userId}_${Date.now()}`;

      // إزالة كلمة المرور قبل تخزين
      const {password: _, ...userWithoutPassword} = user;

      // حفظ التوكن وبيانات المستخدم محلياً
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('current_user', JSON.stringify(userWithoutPassword));

      console.log('✅ تم تسجيل الدخول بنجاح:', {
        email: userWithoutPassword.email,
        uid: userWithoutPassword.uid,
        userId: userId,
        userType: userWithoutPassword.userType,
        fullName: userWithoutPassword.fullName
      });

      return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: userWithoutPassword,
        token: token,
      };
    } catch (error) {
      console.error('❌ خطأ في تسجيل الدخول:', error);

      return {
        success: false,
        message: error.message || 'حدث خطأ أثناء تسجيل الدخول',
        error: error,
      };
    }
  }

  // 3. تسجيل الخروج
  async logout() {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('current_user');

      console.log('✅ تم تسجيل الخروج');

      return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح',
      };
    } catch (error) {
      console.error('❌ خطأ في تسجيل الخروج:', error);
      throw error;
    }
  }

  // 4. التحقق من حالة المصادقة الحالية - باستخدام الـ uid المخزن محلياً
  async checkAuth() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userJson = await AsyncStorage.getItem('current_user');

      if (!token || !userJson) {
        return {
          isAuthenticated: false,
          user: null,
        };
      }

      const user = JSON.parse(userJson);
      
      // التحقق من وجود uid
      if (!user.uid) {
        console.log('❌ لا يوجد uid في بيانات المستخدم المخزنة');
        await this.logout();
        return {
          isAuthenticated: false,
          user: null,
        };
      }

      // جلب بيانات محدثة من Firebase باستخدام uid
      const currentUser = await this.getUserByUid(user.uid);
      
      if (!currentUser) {
        console.log('❌ المستخدم غير موجود في Firebase');
        await this.logout();
        return {
          isAuthenticated: false,
          user: null,
        };
      }

      // إزالة كلمة المرور من البيانات المسترجعة
      const {password: _, ...userWithoutPassword} = currentUser;

      // تحديث بيانات المستخدم المحلية
      await AsyncStorage.setItem('current_user', JSON.stringify(userWithoutPassword));

      return {
        isAuthenticated: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('❌ خطأ في التحقق من المصادقة:', error);
      return {
        isAuthenticated: false,
        user: null,
      };
    }
  }

  // 5. الحصول على بيانات المستخدم الحالي - باستخدام الـ uid
  async getCurrentUser() {
    try {
      const { isAuthenticated, user } = await this.checkAuth();
      
      if (!isAuthenticated) {
        throw {
          success: false,
          message: 'المستخدم غير مسجل الدخول',
        };
      }
      
      // جلب بيانات محدثة من Firebase
      const currentUser = await this.getUserByUid(user.uid);
      
      if (!currentUser) {
        throw {
          success: false,
          message: 'المستخدم غير موجود',
        };
      }
      
      // إزالة كلمة المرور
      const {password: _, ...userWithoutPassword} = currentUser;
      
      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات المستخدم:', error);
      throw error;
    }
  }

  // 6. تحديث بيانات المستخدم - باستخدام الـ uid
  async updateUserProfile(updates) {
    try {
      const { isAuthenticated, user } = await this.checkAuth();
      
      if (!isAuthenticated) {
        throw {
          success: false,
          message: 'المستخدم غير مسجل الدخول',
        };
      }

      // تحديث البيانات المحلية
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('current_user', JSON.stringify(updatedUser));

      // تحديث البيانات في Firebase باستخدام uid
      const userRef = database().ref(`users/${user.uid}`);
      await userRef.update(updates);

      return {
        success: true,
        message: 'تم تحديث الملف الشخصي بنجاح',
        user: updatedUser,
      };
    } catch (error) {
      console.error('❌ خطأ في تحديث الملف الشخصي:', error);
      throw error;
    }
  }

  // 7. تغيير كلمة المرور - باستخدام الـ uid
  async changePassword(currentPassword, newPassword) {
    try {
      const { isAuthenticated, user } = await this.checkAuth();
      
      if (!isAuthenticated) {
        throw {
          success: false,
          message: 'المستخدم غير مسجل الدخول',
        };
      }

      // جلب بيانات المستخدم من Firebase باستخدام uid
      const userData = await this.getUserByUid(user.uid);
      
      if (!userData) {
        throw {
          success: false,
          message: 'المستخدم غير موجود',
        };
      }

      // التحقق من كلمة المرور الحالية
      if (userData.password !== currentPassword) {
        throw {
          success: false,
          message: 'كلمة المرور الحالية غير صحيحة',
        };
      }

      // تحديث كلمة المرور في Firebase
      const userRef = database().ref(`users/${user.uid}`);
      await userRef.update({
        password: newPassword,
        updatedAt: new Date().toISOString(),
      });

      return {
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح',
      };
    } catch (error) {
      console.error('❌ خطأ في تغيير كلمة المرور:', error);
      throw error;
    }
  }
}

// تصدير نسخة واحدة من الخدمة
export default new AuthService();