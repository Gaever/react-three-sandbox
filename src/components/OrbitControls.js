import React, {useEffect, useRef} from 'react';
import { useRender, useThree, extend } from 'react-three-fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls'
extend({ OrbitControls: ThreeOrbitControls });

/*
 * Попытка портировать https://threejs.org/examples/?q=orbi#misc_controls_orbit
 * Пример взят с https://github.com/kysonic/RTF_EXP/blob/b4ead90f504935e12548565257c884ce77536688/src/components/orbital-controls.js
 */

export default function OrbitControls() {
    const controls = useRef();
    const { camera } = useThree();

    useRender(() => controls.current.update());

    return (
        <orbitControls ref={controls} args={[camera]} enableDamping dampingFactor={0.5} />
    );
}
