import React, {useState} from 'react';
import { useThree } from 'react-three-fiber';
import OrbitControls from './OrbitControls';
import DragControls from './DragControls';
import SceneObjects from './SceneObjects';
import useStyles from './ThreeActive/style';
import AuthControl from './AuthControl';

export default function Scene() {
  const { camera } = useThree();
  const classes = useStyles();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const canvasElement = document.querySelector(`.${classes.threeactive} canvas`);
  
  return (
    <>
      <AuthControl onAuth={() => {
        setIsAuthorized(true);
      }}/>
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={1}
        position={[30, 30, 50]}
        angle={0.2}
        penumbra={0.8} 
        castShadow />
      <OrbitControls
        args={[camera, canvasElement]}
        enableDamping
        dampingFactor={0.5} />
      <DragControls />
      {isAuthorized && <SceneObjects />}      
    </>
  );
}
