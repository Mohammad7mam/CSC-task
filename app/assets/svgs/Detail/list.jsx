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
        d="M16.2 3.6a1.8 1.8 0 000 3.6h3.6a1.8 1.8 0 100-3.6h-3.6z"
        fill="#FFC6FF"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.2 9a3.6 3.6 0 013.6-3.6 5.4 5.4 0 005.4 5.4h3.6a5.4 5.4 0 005.4-5.4A3.6 3.6 0 0128.8 9v19.8a3.6 3.6 0 01-3.6 3.6H10.8a3.6 3.6 0 01-3.6-3.6V9zm5.4 7.2a1.8 1.8 0 100 3.6h.018a1.8 1.8 0 100-3.6H12.6zm5.4 0a1.8 1.8 0 100 3.6h5.4a1.8 1.8 0 100-3.6H18zm-5.4 7.2a1.8 1.8 0 100 3.6h.018a1.8 1.8 0 100-3.6H12.6zm5.4 0a1.8 1.8 0 100 3.6h5.4a1.8 1.8 0 100-3.6H18z"
        fill="#FFC6FF"
      />
    </Svg>
  );
}

export default SvgComponent;
