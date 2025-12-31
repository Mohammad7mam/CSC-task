// screens/LoginScreen.js
import React, {useCallback, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  loginUser,
  registerUser,
  updateFormData,
  setRegisterMode,
  clearError,
  incrementLoginAttempts,
} from '../redux/authSlice';
import {
  selectAuthStatus,
  selectFormFields,
  selectIsRegistering,
  selectIsAdmin,
  selectUser,
} from '../redux/authSelectors';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Select data from Redux store using memoized selectors
  const authStatus = useSelector(selectAuthStatus);
  const formFields = useSelector(selectFormFields);
  const isRegistering = useSelector(selectIsRegistering);
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);

  // Memoized callbacks for better performance
  const handleInputChange = useCallback(
    (field, value) => {
      dispatch(updateFormData({[field]: value}));
    },
    [dispatch],
  );

  const handleLogin = useCallback(async () => {
    if (authStatus.isLocked) {
      Alert.alert('Login Locked', authStatus.cooldownMessage);
      return;
    }

    if (!formFields.isValid) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields correctly',
      );
      return;
    }

    dispatch(
      loginUser({
        email: formFields.fields.email.value,
        password: formFields.fields.password.value,
      }),
    );
  }, [
    authStatus.isLocked,
    authStatus.cooldownMessage,
    formFields.isValid,
    formFields.fields,
    dispatch,
  ]);

  const handleRegister = useCallback(async () => {
    if (!formFields.isValid) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields correctly',
      );
      return;
    }

    const userData = {
      email: formFields.fields.email.value,
      password: formFields.fields.password.value,
      firstName: formFields.fields.firstName.value,
      lastName: formFields.fields.lastName.value,
      userType: 'student',
    };

    dispatch(registerUser(userData));
  }, [formFields.isValid, formFields.fields, dispatch]);

  const toggleForm = useCallback(() => {
    dispatch(setRegisterMode(!isRegistering));
    dispatch(clearError());
  }, [isRegistering, dispatch]);

  // Handle navigation after login
  useEffect(() => {
    if (user && authStatus.isAuthenticated) {
      const message = isRegistering
        ? 'Account created successfully'
        : 'Login successful';

      Alert.alert('Success', message, [
        {
          text: 'OK',
          onPress: () => {
            if (isAdmin) {
              navigation.navigate('AdminEnrollments');
            } else {
              navigation.navigate('Home');
            }
          },
        },
      ]);
    }
  }, [user, authStatus.isAuthenticated, isAdmin, isRegistering, navigation]);

  // Handle errors
  useEffect(() => {
    if (authStatus.hasError) {
      Alert.alert('Error', authStatus.error);
      if (!isRegistering) {
        dispatch(incrementLoginAttempts());
      }
    }
  }, [authStatus.hasError, authStatus.error, isRegistering, dispatch]);

  // Memoized form fields for better performance
  const formInputs = useMemo(
    () => [
      ...(isRegistering
        ? [
            {
              key: 'firstName',
              label: 'First Name',
              placeholder: 'Enter first name',
              autoCapitalize: 'words',
            },
            {
              key: 'lastName',
              label: 'Last Name',
              placeholder: 'Enter last name',
              autoCapitalize: 'words',
            },
          ]
        : []),
      {
        key: 'email',
        label: 'Email',
        placeholder: 'example@email.com',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      },
      {
        key: 'password',
        label: 'Password',
        placeholder: '••••••••',
        secureTextEntry: true,
      },
    ],
    [isRegistering],
  );

  // Render form inputs
  const renderFormInputs = useCallback(
    () =>
      formInputs.map(input => {
        const field = formFields.fields[input.key];

        return (
          <View key={input.key} style={styles.inputContainer}>
            <Text style={styles.label}>{input.label}</Text>
            <TextInput
              style={[styles.input, field?.error && styles.inputError]}
              value={field?.value || ''}
              onChangeText={text => handleInputChange(input.key, text)}
              placeholder={input.placeholder}
              placeholderTextColor="#999"
              keyboardType={input.keyboardType}
              autoCapitalize={input.autoCapitalize}
              secureTextEntry={input.secureTextEntry}
              autoCorrect={false}
            />
            {field?.error && (
              <Text style={styles.errorText}>{field.error}</Text>
            )}
            {input.key === 'password' && isRegistering && !field?.error && (
              <Text style={styles.passwordHint}>
                Password must be at least 6 characters
              </Text>
            )}
          </View>
        );
      }),
    [formInputs, formFields.fields, isRegistering, handleInputChange],
  );

  // Loading state
  if (authStatus.isLoading && !authStatus.hasError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C6AF1" />
        <Text style={styles.loadingText}>
          {isRegistering ? 'Creating account...' : 'Signing in...'}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Text style={styles.appTitle}>Welcome Back</Text>
          <Text style={styles.welcomeText}>
            {isRegistering ? 'Create your account' : 'Sign in to continue'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {renderFormInputs()}

          {!isRegistering && (
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() =>
                Alert.alert(
                  'Forgot Password',
                  'This feature is under development',
                )
              }>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!formFields.isValid || authStatus.isLocked) &&
                styles.buttonDisabled,
            ]}
            onPress={isRegistering ? handleRegister : handleLogin}
            disabled={
              !formFields.isValid || authStatus.isLocked || authStatus.isLoading
            }>
            {authStatus.isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isRegistering ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleForm}
            disabled={authStatus.isLoading}>
            <Text style={styles.toggleText}>
              {isRegistering
                ? 'Already have an account? '
                : "Don't have an account? "}
              <Text style={styles.toggleHighlight}>
                {isRegistering ? 'Sign In' : 'Create Account'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ddd',
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 5,
  },
  passwordHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#7C6AF1',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#7C6AF1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 15,
    shadowColor: '#7C6AF1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#5a4cb1',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  dividerText: {
    color: '#888',
    marginHorizontal: 10,
    fontSize: 14,
  },
  toggleButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  toggleText: {
    color: '#aaa',
    fontSize: 14,
  },
  toggleHighlight: {
    color: '#7C6AF1',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
