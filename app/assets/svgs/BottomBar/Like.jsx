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
        clipRule="evenodd"
        d="M16.771 2.29v0a5.954 5.954 0 00-4.774 2.582A5.95 5.95 0 007.23 2.288v0a6.5 6.5 0 00-6.142 6.579v.109a1.504 1.504 0 000 .265C1.384 18.08 12 21.712 12 21.712S22.612 18.08 22.913 9.241a1.86 1.86 0 000-.265v-.11a6.5 6.5 0 00-6.142-6.577z"
        stroke={stroke}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export default SvgComponent;
