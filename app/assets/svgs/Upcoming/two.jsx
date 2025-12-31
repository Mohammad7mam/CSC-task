import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9.912 9.96h4.956M12.389 14.938v-4.98"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M7.433 5.808c0 .917-.74 1.66-1.652 1.66a1.656 1.656 0 01-1.652-1.66c0-.916.74-1.66 1.652-1.66.912 0 1.652.744 1.652 1.66zM7.433 19.09c0 .916-.74 1.66-1.652 1.66a1.656 1.656 0 01-1.652-1.66c0-.917.74-1.66 1.652-1.66.912 0 1.652.743 1.652 1.66zM20.65 5.808c0 .917-.74 1.66-1.652 1.66a1.656 1.656 0 01-1.652-1.66c0-.916.74-1.66 1.652-1.66.912 0 1.652.744 1.652 1.66zM20.65 19.09c0 .916-.74 1.66-1.652 1.66a1.656 1.656 0 01-1.652-1.66c0-.917.74-1.66 1.652-1.66.912 0 1.652.743 1.652 1.66z"
        stroke="#fff"
        strokeWidth={1.5}
      />
      <Path
        d="M7.434 19.086h9.911M17.345 5.813H7.434M18.996 17.428v-9.96M5.781 7.469v9.959"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default SvgComponent;
