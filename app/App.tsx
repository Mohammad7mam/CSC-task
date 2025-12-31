/**
 * ملف المدخل الرئيسي للتطبيق
 * تم تعديله لاستخدام React Navigation
 */
import {I18nManager} from 'react-native';
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import {Provider} from 'react-redux';
import {store} from './redux/store/store';

import {FontProvider} from './contexts/Fonts';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <FontProvider>
          <AppNavigator />
        </FontProvider>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
