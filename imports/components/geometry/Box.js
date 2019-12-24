import React, {useRef, forwardRef, useEffect} from 'react';
import GenericGeometry from '../GenericGeometry';

function Box({ mass = 10000, ...props }, outerRef) {
  const boxRef = outerRef ? outerRef : useRef();
  const [op, setOp] = useState(1);

  return (
    <GenericGeometry ref={boxRef} mass={mass} {...props}>
      <mesh castShadow receiveShadow>
        <boxGeometry attach="geometry" args={[2, 2, 2]} />
        <meshNormalMaterial attach="material"  transparent opacity={op}/>
      </mesh>
    </GenericGeometry>
  );
}

export default forwardRef(Box)