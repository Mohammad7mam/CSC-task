import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_10_1689)">
        <Path
          d="M13.21 11.637a7.313 7.313 0 10-1.572 1.573h-.001c.034.045.07.087.11.129l4.331 4.331a1.125 1.125 0 001.592-1.59l-4.33-4.332a1.144 1.144 0 00-.13-.112zm.29-4.325a6.187 6.187 0 11-12.373 0 6.187 6.187 0 0112.373 0z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_10_1689">
          <Path fill="#fff" d="M0 0H18V18H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
