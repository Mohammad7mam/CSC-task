import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native';

const AppSimple = () => {
  const [firstName, setFirstName] = useState('Test');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  // ⭐⭐ اختر IP حسب المنصة ⭐⭐
  const getServerIP = () => {
    if (__DEV__) {
      if (Platform.OS === 'android') {
        return '10.0.2.2'; // للمحاكي Android
      } else if (Platform.OS === 'ios') {
        return 'localhost'; // للمحاكي iOS
      }
    }
    return '192.168.1.98'; // للجهاز الحقيقي
  };

  const SERVER_IP = getServerIP();
  const API_URL = `http://${SERVER_IP}:8000/api/v1/auth/register`;

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // ⭐⭐ زيادة المهلة الزمنية ⭐⭐
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);

      // ✅ معالجة الردود المختلفة
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || `HTTP error ${response.status}`);
        }
        
        Alert.alert(
          'Success ✅',
          `تم التسجيل بنجاح!\n\nالاسم: ${data.user?.displayName || firstName}\nالبريد: ${data.user?.email || email}`
        );
        
        // Clear form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        throw new Error(`Received non-JSON response: ${text.substring(0, 100)}`);
      }

    } catch (error) {
      console.error('Full error:', error);
      
      let errorMessage = 'فشل التسجيل';
      
      if (error.name === 'AbortError') {
        errorMessage = 'انتهت مهلة الاتصال. تأكد من:\n1. تشغيل السيرفر\n2. IP صحيح\n3. Port مفتوح';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = `مشكلة في الشبكة\n\nIP المستخدم: ${SERVER_IP}\nPort: 8000\n\nتأكد من:\n1. السيرفر شغال (npm start)\n2. كلا الجهازين على نفس الشبكة\n3. جدار الحماية لا يمنع الاتصال`;
      } else if (error.message.includes('JSON')) {
        errorMessage = 'استجابة غير متوقعة من السيرفر';
      }
      
      Alert.alert('Error ❌', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const testUrl = `http://${SERVER_IP}:8000/api/v1/auth/test`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(testUrl, { 
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          'Connection Test ✅',
          `الخادم شغال!\n\nIP: ${SERVER_IP}\nPort: 8000\nرسالة: ${data.message}`
        );
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      Alert.alert(
        'Connection Test ❌',
        `فشل الاتصال\n\nIP: ${SERVER_IP}\nPort: 8000\n\nحلول:\n1. تأكد من تشغيل السيرفر\n2. جرب IP آخر\n3. تحقق من جدار الحماية\n4. تأكد من وجود /test endpoint`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل مستخدم جديد</Text>
      <Text style={styles.subtitle}>الخادم: {SERVER_IP}:8000</Text>
       <Text style={styles.subtitle}>
        الخادم: {SERVER_IP}:8000
        {'\n'}
        المنصة: {Platform.OS} {__DEV__ ? '(تطوير)' : '(إنتاج)'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="الاسم الأول"
        value={firstName}
        onChangeText={setFirstName}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="الاسم الأخير"
        value={lastName}
        onChangeText={setLastName}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>تسجيل الحساب</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.testButton}
        onPress={testConnection}
        disabled={loading}
      >
        <Text style={styles.testButtonText}>اختبار الاتصال بالخادم</Text>
      </TouchableOpacity>
      
      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>ملاحظة:</Text>
        <Text style={styles.noteText}>
          إذا فشل التسجيل، اضغط أولاً على "اختبار الاتصال بالخادم"
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noteBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e8f4fc',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    textAlign: 'right',
  },
  noteText: {
    fontSize: 12,
    color: '#34495e',
    lineHeight: 18,
    textAlign: 'right',
  },
});

export default AppSimple;