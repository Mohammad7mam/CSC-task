import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  const fillColor = props.color || props.fill || '#fff';

  return (
    <Svg
      width={18}
      height={26}
      viewBox="0 0 18 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M4.333 17.836h3.834v3.833a3.836 3.836 0 01-3.834 3.834A3.835 3.835 0 01.5 21.669a3.835 3.835 0 013.833-3.833zM4.333 9.164h3.834v7.667H4.333A3.836 3.836 0 01.5 12.997a3.835 3.835 0 013.833-3.833zM4.333.5h3.834v7.667H4.333A3.836 3.836 0 01.5 4.333 3.835 3.835 0 014.333.5zM13.001.5a3.836 3.836 0 013.834 3.833 3.836 3.836 0 01-3.834 3.834H9.168V.5h3.833zM13.001 9.164a3.836 3.836 0 013.834 3.833 3.836 3.836 0 01-3.834 3.834 3.836 3.836 0 01-3.833-3.834 3.835 3.835 0 013.833-3.833z"
        stroke={fillColor}
      />
    </Svg>
  );
}

export default SvgComponent;
