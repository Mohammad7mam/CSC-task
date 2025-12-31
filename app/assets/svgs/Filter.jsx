import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={31}
      height={22}
      viewBox="0 0 31 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path stroke="#fff" strokeWidth={0.5} d="M0.25 5.36298L0.25 16.637" />
      <Path
        d="M18.465 8h8.913m-8.913 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-5.544 6h8.544m0 0a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
