import React, { useState, forwardRef, useEffect } from 'react';
import { useUpdate } from 'react-three-fiber';
import * as CANNON from 'cannon';
import * as THREE from 'three';
import {useCannon} from '../../use-cannon';
import {useDraggable} from '../../context';

export default forwardRef(({position}, ref) => {
    const { mouseConstraint } = useDraggable();
    const [jointBody, setJointBody] = useState(null);

    const cannonRef = useCannon({ mass: 0 }, body => {
        body.addShape(new CANNON.Sphere(0.1));
        body.collisionFilterGroup = 0;
        body.collisionFilterMask = 0;
        setJointBody(body);
    }, [], ref);
    
    const meshRef = useUpdate(() => {
        if (!mouseConstraint || !position) return;

        const { x, y, z } = position;
        
        jointBody.position.set(x, y, z);
        mouseConstraint.update();
    }, [position], cannonRef);

    useEffect(() => {
        meshRef.current.body = jointBody;
    }, [jointBody]);
      
    return <mesh ref={meshRef} position={position || new THREE.Vector3(0,0,0)}/>;
});
