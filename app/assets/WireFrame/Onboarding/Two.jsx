import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
import {View, StyleSheet, Dimensions} from 'react-native';

function SvgComponent(props) {
    const {width, height} = Dimensions.get('window');

  return (
    <Svg
      width={width*0.864}
      height={width*0.282}
      viewBox="0 0 324 106"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={218} height={18} rx={9} fill="#fff" />
      <Rect y={44} width={323.677} height={18} rx={9} fill="#fff" />
      <Rect y={88} width={296.07} height={18} rx={9} fill="#fff" />
    </Svg>
  );
}

export default SvgComponent;
