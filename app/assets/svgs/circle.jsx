import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';

function Circle(props) {
  return (
    <Svg
      width={255}
      height={255}
      viewBox="0 0 255 255"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect
        width={255}
        height={255}
        rx={127.5}
        fill="#fff"
        fillOpacity={props.fillOpacity || 0.05} // استخدام القيمة الممررة أو الافتراضية
      />
    </Svg>
  );
}

export default Circle;
