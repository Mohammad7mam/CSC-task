import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {View, StyleSheet, Dimensions} from 'react-native';

function SvgComponent(props) {
  const {width, height} = Dimensions.get('window');

  return (
    <Svg
      width={width}
      height={width * 1.173333333333333}
      viewBox="0 0 375 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M0 0h375v407.59c0 17.673-14.327 32-32 32H32c-17.673 0-32-14.327-32-32V0z"
        fill="#1F1F1F"
      />
    </Svg>
  );
}

export default SvgComponent;
