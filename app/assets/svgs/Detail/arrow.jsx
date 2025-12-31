import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent({fillColor = "#FFD6A5", ...props}) { // قيمة افتراضية
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={fillColor} // استخدام prop اللون
        d="M11 19.803a8.8 8.8 0 100-17.6 8.8 8.8 0 000 17.6zm4.077-9.578l-3.3-3.3a1.1 1.1 0 10-1.556 1.556l1.423 1.422H7.699a1.1 1.1 0 100 2.2h3.945l-1.423 1.422a1.1 1.1 0 101.556 1.556l3.3-3.3a1.1 1.1 0 000-1.556z"
      />
    </Svg>
  );
}

export default SvgComponent;