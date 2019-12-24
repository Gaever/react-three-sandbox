import React from 'react';
import * as THREE from 'three';

export default function ClickMarker({ visible, position }) {
    return (
        <mesh visible={visible} position={position || new THREE.Vector3(0,0,0)}>
            <sphereGeometry attach="geometry" args={[0.2, 8, 8]} />
            <meshLambertMaterial attach="material" color={0xff0000} />
        </mesh>
    );
}
