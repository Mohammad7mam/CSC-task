import { createSelector } from '@reduxjs/toolkit';

// Basic Selectors
export const selectAuthState = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsRegistering = (state) => state.auth.isRegistering;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectError = (state) => state.auth.error;
export const selectFormData = (state) => state.auth.formData;
export const selectTouchedFields = (state) => state.auth.touchedFields;
export const selectFormSubmitted = (state) => state.auth.formSubmitted;
export const selectLoginAttempts = (state) => state.auth.loginAttempts;
export const selectLastLoginAttempt = (state) => state.auth.lastLoginAttempt;

// Memoized Selectors
export const selectIsAdmin = createSelector(
  [selectUser],
  (user) => user?.userType === 'admin'
);

export const selectFormValidation = createSelector(
  [selectFormData, selectIsRegistering, selectTouchedFields, selectFormSubmitted],
  (formData, isRegistering, touchedFields, formSubmitted) => {
    const errors = {};
    let isValid = true;

    // دالة مساعدة لتحديد إذا كان يجب عرض الخطأ
    const shouldShowError = (fieldName, isRequired = true) => {
      // اعرض الخطأ إذا:
      // 1. الحقل ملموس (المستخدم كتب فيه) وكان به خطأ
      // 2. أو تم إرسال الفورم والحقل مطلوب وكان فارغاً
      return (
        (touchedFields[fieldName] && formData[fieldName].length > 0) ||
        (formSubmitted && isRequired && !formData[fieldName])
      );
    };

    // Email validation - مطلوب دائماً
    if (!formData.email.trim()) {
      if (shouldShowError('email', true)) {
        errors.email = 'Email is required';
      }
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      if (shouldShowError('email', true)) {
        errors.email = 'Email is invalid';
      }
      isValid = false;
    }

    // Password validation - مطلوب دائماً
    if (!formData.password) {
      if (shouldShowError('password', true)) {
        errors.password = 'Password is required';
      }
      isValid = false;
    } else if (formData.password.length < 6) {
      if (shouldShowError('password', true)) {
        errors.password = 'Password must be at least 6 characters';
      }
      isValid = false;
    }

    // Registration specific validation
    if (isRegistering) {
      // First name - مطلوب للتسجيل فقط
      if (!formData.firstName.trim()) {
        if (shouldShowError('firstName', true)) {
          errors.firstName = 'First name is required';
        }
        isValid = false;
      }

      // Last name - مطلوب للتسجيل فقط
      if (!formData.lastName.trim()) {
        if (shouldShowError('lastName', true)) {
          errors.lastName = 'Last name is required';
        }
        isValid = false;
      }
    }

    // التحقق النهائي: إذا كان هناك أي خطأ معروض، الفورم غير صالح
    if (Object.keys(errors).length > 0) {
      isValid = false;
    }

    return {
      errors,
      isValid,
      hasErrors: Object.keys(errors).length > 0,
      allFieldsValid: Object.keys(errors).length === 0,
    };
  }
);

export const selectLoginCooldown = createSelector(
  [selectLoginAttempts, selectLastLoginAttempt],
  (attempts, lastAttempt) => {
    if (attempts >= 5 && lastAttempt) {
      const lastAttemptTime = new Date(lastAttempt);
      const now = new Date();
      const diffMinutes = (now - lastAttemptTime) / (1000 * 60);
      
      if (diffMinutes < 15) {
        const remainingMinutes = Math.ceil(15 - diffMinutes);
        return {
          isLocked: true,
          remainingMinutes,
          message: `Too many login attempts. Try again in ${remainingMinutes} minutes.`,
        };
      }
    }
    
    return {
      isLocked: false,
      remainingMinutes: 0,
      message: null,
    };
  }
);

export const selectUserDisplayInfo = createSelector(
  [selectUser],
  (user) => {
    if (!user) return null;
    
    return {
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      initials: `${(user.firstName?.[0] || '')}${(user.lastName?.[0] || '')}`.toUpperCase(),
      email: user.email,
      userType: user.userType,
      isVerified: user.emailVerified || false,
      joinDate: user.createdAt || null,
    };
  }
);

export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectIsLoading, selectError, selectLoginCooldown],
  (isAuthenticated, isLoading, error, cooldown) => ({
    isAuthenticated,
    isLoading,
    hasError: !!error,
    error,
    isLocked: cooldown.isLocked,
    cooldownMessage: cooldown.message,
    canLogin: !isLoading && !cooldown.isLocked,
    status: isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated',
  })
);

export const selectFormFields = createSelector(
  [selectFormData, selectFormValidation, selectTouchedFields],
  (formData, validation, touchedFields) => ({
    fields: {
      email: {
        value: formData.email,
        error: validation.errors.email,
        touched: touchedFields.email,
        required: true,
        type: 'email',
        showError: (touchedFields.email || validation.errors.email) && validation.errors.email,
      },
      password: {
        value: formData.password,
        error: validation.errors.password,
        touched: touchedFields.password,
        required: true,
        type: 'password',
        showError: (touchedFields.password || validation.errors.password) && validation.errors.password,
      },
      firstName: {
        value: formData.firstName,
        error: validation.errors.firstName,
        touched: touchedFields.firstName,
        required: false,
        type: 'text',
        showError: (touchedFields.firstName || validation.errors.firstName) && validation.errors.firstName,
      },
      lastName: {
        value: formData.lastName,
        error: validation.errors.lastName,
        touched: touchedFields.lastName,
        required: false,
        type: 'text',
        showError: (touchedFields.lastName || validation.errors.lastName) && validation.errors.lastName,
      },
    },
    isValid: validation.isValid,
    hasErrors: validation.hasErrors,
    allFieldsValid: validation.allFieldsValid,
  })
);

// جديد: selector للتحقق من صحة حقل معين
export const selectFieldValidation = (fieldName) => createSelector(
  [selectFormFields],
  (formFields) => formFields.fields[fieldName] || null
);