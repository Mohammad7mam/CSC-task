// src/components/CustomText.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useFonts } from '../contexts/Fonts';
import PropTypes from 'prop-types';

const CustomText = ({
  children,
  style,
  fontFamily,
  fontSize,
  color,
  lineHeight,
  letterSpacing,
  fontWeight = '400',
  italic = false,
  textAlign,
  numberOfLines,
  ellipsizeMode,
  ...props
}) => {
  const { fontsLoaded, getFontByWeight } = useFonts();

  if (!fontsLoaded) {
    return (
      <Text
        style={[
          styles.baseText,
          { fontFamily: 'System' },
          fontSize && { fontSize },
          color && { color },
          italic && { fontStyle: 'italic' },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  }

  const selectedFontFamily = fontFamily || getFontByWeight(fontWeight, italic);

  return (
    <Text
      style={[
        styles.baseText,
        { fontFamily: selectedFontFamily },
        fontSize && { fontSize },
        color && { color },
        lineHeight && { lineHeight },
        letterSpacing && { letterSpacing },
        textAlign && { textAlign },
        // لا نحتاج fontStyle لأن الخط المائل مدمج في اسم الخط
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...props}
    >
      {children}
    </Text>
  );
};

CustomText.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  color: PropTypes.string,
  lineHeight: PropTypes.number,
  letterSpacing: PropTypes.number,
  fontWeight: PropTypes.oneOf([
    '100', '200', '300', '400', '500', '600', '700', '800', '900',
    'normal', 'bold', 'extralight', 'light', 'medium', 'semibold', 'extrabold'
  ]),
  italic: PropTypes.bool,
  textAlign: PropTypes.string,
  numberOfLines: PropTypes.number,
  ellipsizeMode: PropTypes.oneOf(['head', 'middle', 'tail', 'clip']),
};

const styles = StyleSheet.create({
  baseText: {
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
});

export default CustomText;