import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
   const { 
    fill = 'transparent',  // قيمة افتراضية شفافة
    stroke = '#FFFFFF',    // قيمة افتراضية بيضاء
    width = 24, 
    height = 24 
  } = props;
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9.25 3.513c1.25-.968 3.299-1.02 4.6-.108h0l5.76 4.03c.429.3.849.804 1.162 1.404.314.601.488 1.235.488 1.761v6.78a3.872 3.872 0 01-3.87 3.87H6.61a3.88 3.88 0 01-3.87-3.88v-6.9c0-.487.156-1.088.442-1.669.286-.58.67-1.076 1.059-1.38l5.008-3.909v.001zM12 13.5c-.824 0-1.5.676-1.5 1.5v3c0 .824.676 1.5 1.5 1.5s1.5-.676 1.5-1.5v-3c0-.824-.676-1.5-1.5-1.5z"
        stroke={stroke}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export default SvgComponent;
