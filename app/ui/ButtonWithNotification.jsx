import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ButtonWithNotification = ({
  text = "Start Learning",
  notificationMessage = "مرحبًا بك في دورة React Native!",
  notificationTitle = "Login",
  onPress,
  ...props
}) => {
  const navigation = useNavigation();
  
  // دالة التعامل مع النقر للانتقال إلى شاشة Login
  const handlePress = () => {
    try {
      // الانتقال إلى شاشة Login
      // تأكد من أن 'Login' مسجلة في navigator
      navigation.navigate('Login', {
        notificationMessage: notificationMessage,
        notificationTitle: notificationTitle
      });
      
      // استدعاء الدالة الممررة عبر props إن وجدت
      if (onPress) {
        onPress();
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // يمكنك إظهار رسالة خطأ بديلة هنا
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
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
    marginTop: 20
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default ButtonWithNotification;