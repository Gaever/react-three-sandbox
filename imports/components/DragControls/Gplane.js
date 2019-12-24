import React, { useEffect, forwardRef, useContext } from 'react';
import { useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { context, useDraggable } from '../../context';

export default forwardRef(({ point }, ref) => {
    const { camera } = useThree();
    const { setState, state } = useContext(context);
    const { capturedId } = useDraggable();

    useEffect(() => {
        if (!point) return;
        // Make it face toward the camera
        ref.current.quaternion.copy(camera.quaternion);
    }, [point]);

    return (
        <mesh
            onPointerMove={(e) => {
                if (capturedId) {
                    setState({
                        ...state,
                        jointBodyPoint: e.point,
                    });
                }
            }}
            ref={ref} position={point || new THREE.Vector3(0, 0, 0)}>
            <planeGeometry attach="geometry" args={[100, 100]} />
            <meshLambertMaterial attach="material" color={0x777777} visible={false} />
        </mesh>
    );
});
