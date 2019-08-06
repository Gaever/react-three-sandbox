import React, {useEffect, useRef} from 'react';
import {useRender, useThree, extend} from 'react-three-fiber';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
extend({ OrbitControls });

/*
 * Попытка портировать https://threejs.org/examples/?q=orbi#misc_controls_orbit
 * Пример взят с https://github.com/kysonic/RTF_EXP/blob/b4ead90f504935e12548565257c884ce77536688/src/components/orbital-controls.js
 */

export default ({fov = 100, position = [0, 0, 20], rotateSpeed = 0.5}) => {
    const camera = useRef();
    const controls = useRef();
    const { setDefaultCamera } = useThree();
    useEffect(() => void setDefaultCamera(camera.current), []);
    useRender(() => controls.current.update());

    return (
        <React.Fragment>
            <perspectiveCamera
                ref={camera}
                fov={fov}
                position={position}
                onUpdate={self => self.updateProjectionMatrix()}
            />
            {camera.current && (
                <orbitControls ref={controls} args={[camera.current]} enableDamping dampingFactor={0.5} rotateSpeed={rotateSpeed} />
            )}
        </React.Fragment>
    );
}
