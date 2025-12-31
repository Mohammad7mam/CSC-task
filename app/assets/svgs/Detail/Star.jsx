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
        d="M16.288 5.269c.539-1.659 2.885-1.659 3.424 0l1.925 5.925a1.8 1.8 0 001.712 1.244h6.23c1.744 0 2.469 2.231 1.058 3.256l-5.04 3.662a1.8 1.8 0 00-.654 2.012l1.925 5.926c.539 1.658-1.359 3.037-2.77 2.012l-5.04-3.662a1.8 1.8 0 00-2.116 0l-5.04 3.662c-1.411 1.025-3.31-.354-2.77-2.012l1.925-5.926a1.8 1.8 0 00-.654-2.012l-5.04-3.662c-1.41-1.025-.686-3.256 1.058-3.256h6.23a1.8 1.8 0 001.712-1.244l1.925-5.925z"
        fill="#FFD6A5"
      />
    </Svg>
  );
}

export default SvgComponent;
