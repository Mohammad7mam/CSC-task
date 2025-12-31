import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 32.4c7.953 0 14.4-6.447 14.4-14.4S25.953 3.6 18 3.6 3.6 10.047 3.6 18 10.047 32.4 18 32.4zm1.8-21.6a1.8 1.8 0 10-3.6 0V18c0 .477.19.935.527 1.273l5.091 5.09a1.8 1.8 0 102.546-2.545L19.8 17.254V10.8z"
        fill="#E1DCFF"
      />
    </Svg>
  );
}

export default SvgComponent;
