import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M3 12c0-.18.057-.358.168-.504l.073-.084 6.6-6.67a.81.81 0 011.156.002.84.84 0 01.071 1.09l-.073.085-5.196 5.25h14.383c.451 0 .818.373.818.831a.827.827 0 01-.716.824l-.102.006H3.818a.817.817 0 01-.756-.514A.84.84 0 013 12zm2.96 2.99c0-.211.079-.423.238-.586a.807.807 0 011.073-.076l.084.074 3.64 3.68a.84.84 0 01.003 1.174.812.812 0 01-1.074.076l-.084-.074L6.2 15.579a.832.832 0 01-.241-.589z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SvgComponent;
