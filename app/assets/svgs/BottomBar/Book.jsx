import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={23}
      height={23}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.922 2.765c0-.509.412-.921.922-.921h5.53a4.609 4.609 0 013.687 1.843 4.61 4.61 0 013.687-1.843h5.53c.51 0 .923.412.923.921v13.827c0 .509-.413.922-.922.922h-6.453a1.843 1.843 0 00-1.843 1.843.922.922 0 11-1.844 0 1.843 1.843 0 00-1.843-1.843H1.844a.922.922 0 01-.922-.922V2.765zm9.217 13.399a3.687 3.687 0 00-1.843-.494h-5.53V3.687h4.608a2.765 2.765 0 012.765 2.765v9.712zm1.844 0a3.687 3.687 0 011.843-.494h5.531V3.687h-4.609a2.765 2.765 0 00-2.765 2.765v9.712z"
        fill="#fff"
                stroke={"transparent"}
        strokeWidth={1.5}

      />
    </Svg>
  );
}

export default SvgComponent;
