import * as React from "react"
import Svg, { Rect } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={2}
      height={8}
      viewBox="0 0 2 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={1.71517} height={1.71517} rx={0.6} fill="#fff" />
      <Rect y={2.71875} width={1.71517} height={1.71517} rx={0.6} fill="#fff" />
      <Rect y={5.42969} width={1.71517} height={1.71517} rx={0.6} fill="#fff" />
    </Svg>
  )
}

export default SvgComponent
