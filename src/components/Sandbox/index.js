import React, { useEffect, useState, useRef } from 'react';
import { extend, useThree, useRender } from 'react-three-fiber'
import { Provider } from '../../helpers/useCannon';
// import OrbitControls from '../../components/OrbitControls';
import Box from '../../components/geometry/Box';
import Plane from '../../components/geometry/Plane';
import EditableHOC from '../geometry/EditableHOC';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import './styles.css';

extend({ OrbitControls });

/*
 * Есть ли примеры порта https://threejs.org/examples/?q=dragg#webgl_interactive_draggablecubes ?
 */
export default function Sandbox() {
  const [showPlane, set] = useState(true);

  // Попытка портировать https://threejs.org/examples/?q=transform#misc_controls_transform
  // const EditableBox = EditableHOC(Box);
  useEffect(() => void setTimeout(() => set(false), 5000), []);
  const { camera } = useThree();
  const controls = useRef();
  useRender(() => controls.current.update());
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight intensity={1} position={[30, 30, 50]} angle={0.2} penumbra={0.8} castShadow />
      <orbitControls ref={controls} args={[camera]} enableDamping dampingFactor={0.5} />
      <Provider>
        <Plane position={[0, 0, -10]} />
        {showPlane && <Plane position={[0, 0, 0]} />}
        <Box position={[1, 0, 1]} onDrag={(console.log('DRAG'))} />
        <Box position={[2, 1, 5]} />
        <Box position={[0, 0, 6]} />
        <Box position={[-1, 1, 8]} />
        <Box position={[-2, 2, 13]} />
        <Box position={[2, -1, 13]} />
        {!showPlane && <Box position={[0.5, 1.0, 20]} />}
      </Provider>
    </>    
  );
}
