import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
import {View, StyleSheet, Dimensions} from 'react-native';


function SvgComponent(props) {
      const {width, height} = Dimensions.get('window');
  return (
    <Svg
      width={width*0.816}
      height={width*0.077}
      viewBox="0 0 306 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={305.544} height={7} rx={3.5} fill="#ADADAD" />
      <Rect y={22} width={212.447} height={7} rx={3.5} fill="#ADADAD" />
    </Svg>
  );
}

export default SvgComponent;
