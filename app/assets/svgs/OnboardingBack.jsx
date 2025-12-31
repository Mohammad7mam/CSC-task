import * as React from 'react';
import Svg, {G, Path, Rect, Defs, ClipPath} from 'react-native-svg';
import {Dimensions} from 'react-native';

function SvgComponent(props) {
  const {width, height} = Dimensions.get('window');

  return (
    <Svg
      width={width * 0.875}
      height={width * 0.875}
      viewBox="0 0 327 327"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_2206_1099)">
        <Path
          d="M109 56.428C109 85.463 85.463 109 56.428 109h-3.856C23.537 109 0 85.463 0 56.428V-.004h109v56.432z"
          fill="#E0533D"
        />
        <Path
          d="M0 165.435c0 29.035 23.537 52.573 52.572 52.573h56.432V109.004H0v56.431z"
          fill="#377CC8"
        />
        <Path
          d="M56.431 327.008c29.035 0 52.573-23.538 52.573-52.573v-56.431H52.573C23.538 218.004 0 241.542 0 270.577v56.431h56.431z"
          fill="#E78C9D"
        />
        <Rect
          x={109.004}
          width={109.004}
          height={109.004}
          rx={54.5018}
          fill="#9DA7D0"
        />
        <Path
          fill="#EED868"
          d="M109.004 109H218.008V218.00400000000002H109.004z"
        />
        <Path
          d="M109.004 270.58c0-29.035 23.537-52.572 52.572-52.572h3.856c29.034 0 52.572 23.537 52.572 52.572v56.431h-109V270.58zM218.008 0h56.431c29.035 0 52.572 23.537 52.572 52.572v56.432H218.008V0z"
          fill="#469B88"
        />
        <Path
          d="M218.008 218.008h56.431c29.035 0 52.572-23.538 52.572-52.573v-56.431H218.008v109.004z"
          fill="#EED868"
        />
        <Rect
          x={218.008}
          y={218.008}
          width={109.004}
          height={109.004}
          rx={54.5018}
          fill="#377CC8"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2206_1099">
          <Rect width={width * 0.875} height={width * 0.875} rx={1.05145} fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
