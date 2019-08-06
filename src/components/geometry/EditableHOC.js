import React from 'react';
import {extend, useThree, useRef} from 'react-three-fiber';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

// Не работает, сыпет ошибками
// extend({ TransformControls });

export default function EditableHOC(component) {
    const { camera, canvas } = useThree();
    const {
        current: {
            render,
        } = {},
    } = useRef() || {};

    // Как передать OrbitControls сюда?
    // Как сделать свой хук вроде useOrbit()?
    const orbit= useOrbit();
    
    const control = new TransformControls(camera, canvas);
    control.addEventListener( 'change', render );

    control.addEventListener( 'dragging-changed', function ( event ) {
        orbit.enabled = !event.value;
    });
    control.attach(component);

    return component;
}
