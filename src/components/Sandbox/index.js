import React, { useEffect, useState } from 'react';
import { Canvas } from 'react-three-fiber'
import { Provider } from '../../helpers/useCannon';
import OrbitControls from '../../components/OrbitControls';
import Box from '../../components/geometry/Box';
import Plane from '../../components/geometry/Plane';
import EditableHOC from '../geometry/EditableHOC';
import './styles.css';

/*
 * Есть ли примеры порта https://threejs.org/examples/?q=dragg#webgl_interactive_draggablecubes ?
 */
export default function Sandbox() {
  const [showPlane, set] = useState(true);

  // Попытка портировать https://threejs.org/examples/?q=transform#misc_controls_transform
  const ExitableBox = EditableHOC(Box);
  useEffect(() => void setTimeout(() => set(false), 5000), []);
  
  return (
    <Canvas
      camera={{ position: [0, 0, 15] }}>
      <ambientLight intensity={0.5} />
      <spotLight intensity={1} position={[30, 30, 50]} angle={0.2} penumbra={0.8} castShadow />
      <OrbitControls/>
      <Provider>
        <Plane position={[0, 0, -10]} />
        {showPlane && <Plane position={[0, 0, 0]} />}
        <ExitableBox position={[1, 0, 1]} onDrag={(console.log('DRAG'))} />
        <ExitableBox position={[2, 1, 5]} />
        <ExitableBox position={[0, 0, 6]} />
        <ExitableBox position={[-1, 1, 8]} />
        <ExitableBox position={[-2, 2, 13]} />
        <ExitableBox position={[2, -1, 13]} />
        {!showPlane && <Box position={[0.5, 1.0, 20]} />}
      </Provider>
    </Canvas>    
  );
}
