// src/contexts/Fonts.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const FontContext = createContext();

export const useFonts = () => useContext(FontContext);

export const FontProvider = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFontsLoaded(true);
      console.log('✅ الخطوط جاهزة');
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // دالة للحصول على اسم الخط بناءً على الوزن والنمط (عادي أو مائل)
  const getFontByWeight = (weight = '400', italic = false) => {
    console.log(`🔍 طلب وزن: ${weight}, مائل: ${italic}`);
    
    let numericWeight = 400;
    
    // تحويل الوزن النصي إلى رقم
    if (typeof weight === 'string') {
      const weightLower = weight.toLowerCase();
      
      switch(weightLower) {
        case '100':
        case '200':
        case 'extralight':
        case 'ultralight':
        case 'thin':
          numericWeight = 200;
          break;
        case '300':
        case 'light':
          numericWeight = 300;
          break;
        case '400':
        case 'normal':
        case 'regular':
          numericWeight = 400;
          break;
        case '500':
        case 'medium':
          numericWeight = 500;
          break;
        case '600':
        case 'semibold':
        case 'demibold':
          numericWeight = 600;
          break;
        case '700':
        case 'bold':
          numericWeight = 700;
          break;
        case '800':
        case '900':
        case 'extrabold':
        case 'ultrabold':
        case 'black':
          numericWeight = 800;
          break;
        default:
          numericWeight = 400;
      }
    } else {
      numericWeight = weight;
    }

    // تحديد اسم الخط بناءً على الوزن
    let fontFamily;
    
    if (numericWeight <= 200) {
      fontFamily = italic ? 'PlusJakartaSans-ExtraLightItalic' : 'PlusJakartaSans-ExtraLight';
    } else if (numericWeight <= 300) {
      fontFamily = italic ? 'PlusJakartaSans-LightItalic' : 'PlusJakartaSans-Light';
    } else if (numericWeight <= 400) {
      // هنا خاصية: لدينا PlusJakartaSans-Italic كخط منفصل للـ Regular Italic
      fontFamily = italic ? 'PlusJakartaSans-Italic' : 'PlusJakartaSans-Regular';
    } else if (numericWeight <= 500) {
      fontFamily = italic ? 'PlusJakartaSans-MediumItalic' : 'PlusJakartaSans-Medium';
    } else if (numericWeight <= 600) {
      fontFamily = italic ? 'PlusJakartaSans-SemiBoldItalic' : 'PlusJakartaSans-SemiBold';
    } else if (numericWeight <= 700) {
      fontFamily = italic ? 'PlusJakartaSans-BoldItalic' : 'PlusJakartaSans-Bold';
    } else {
      fontFamily = italic ? 'PlusJakartaSans-ExtraBoldItalic' : 'PlusJakartaSans-ExtraBold';
    }

    console.log(`✅ تحويل ${weight} (مائل: ${italic}) إلى: ${fontFamily}`);
    return fontFamily;
  };

  const value = {
    fontsLoaded,
    getFontByWeight,
  };

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
};