import React, { forwardRef } from 'react';
import { useThree } from 'react-three-fiber';
import { TransformControls as THREETransformControls } from 'three-full';
import { useOrbit } from './OrbitControls';

function TransformControls(props, meshRef) {
  const { children } = props;
  const { camera, scene, canvas } = useThree();  
  const orbitRef = useOrbit();
  
  const control = new THREETransformControls(camera, canvas);
  control.attach(meshRef.current);
  scene.add(control);

  control.addEventListener( 'dragging-changed', function ( event ) {
    orbitRef.enabled = !event.value;
  });

  return (
      <mesh ref={meshRef}>
        {children}
      </mesh>
  );
}

export default forwardRef(TransformControls);