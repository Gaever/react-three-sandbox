import React from 'react';
import ClickMarker from './ClickMarker';
import Gplane from './Gplane';
import JointBody from './JointBody';
import { useDraggable } from '../../context';

export default function DragControls(props) {
    const {
        gplaneRef,
        jointBodyPoint,
        jointBodyRef,
        showClickMaker,
    } = useDraggable();

    return (
        <>
            <JointBody ref={jointBodyRef} position={jointBodyPoint} />
            <Gplane ref={gplaneRef} point={jointBodyPoint} />
            <ClickMarker visible={showClickMaker} position={jointBodyPoint}/>
        </>
    );
}