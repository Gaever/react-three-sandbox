import React, { useRef } from 'react';
import { extend, useThree } from 'react-three-fiber';
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

    const control = new TransformControls(camera, canvas);
    control.addEventListener( 'change', render );

    control.addEventListener( 'dragging-changed', function ( event ) {
        console.log('dragging-changed');
        // orbit.enabled = !event.value;
    });
    control.attach(component.current);

    return component;
}
