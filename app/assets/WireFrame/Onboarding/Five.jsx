import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
import {View, StyleSheet, Dimensions} from 'react-native';


function SvgComponent(props) {
          const {width, height} = Dimensions.get('window');

  return (
    <Svg
      width={width*0.875}
      height={width*0.168}
      viewBox="0 0 328 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={328} height={63} rx={31.5} fill="#7C6AF1" />
      <Rect x={103} y={27} width={122} height={9} rx={4.5} fill="#fff" />
    </Svg>
  );
}

export default SvgComponent;
