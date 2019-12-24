import React, { forwardRef, useState } from 'react';
import Draggable from '../DragControls/Draggable';
import RemoteLocationController from './RemoteLocationController';

export const GENERIC_ID = -1;

function GenericGeometry(props, genericGeomRef) {
  const {
    children,
    position: outerPosition,
    quaternion: outerQuaternion,
    mass = 10000,
    draggable = false,
    // See bodyShape usage inside useCannon in Draggable component
    bodyShape,
    ...origProps
  } = props;
    
  const extendedProps = Object.assign(
    {},
    draggable
      ? null
      : { position: outerPosition },
    { ...origProps },
  );
  const extendedMesh = React.cloneElement(children, extendedProps);

  const [position, setPosition] = useState(outerPosition)
  const [quaternion, setQuaternion] = useState(outerQuaternion);
  const [velocity, setVelocity] = useState([0,0,0]);

  const [shallApplyEffect, setShallApplyEffect] = useState(false);

  if (draggable) {
    return (
      <RemoteLocationController
        ref={genericGeomRef}
        onPositionChange={setPosition}
        onQuaternionChange={setQuaternion}
        onVelocityChange={setVelocity}

        onShallApplyEffect={() => {
          setShallApplyEffect(true);
        }}
        >
          <Draggable
            ref={genericGeomRef}
            position={position}
            quaternion={quaternion}
            velocity={velocity}
            mass={mass}
            bodyShape={bodyShape}
            shallApplyEffect={shallApplyEffect}
            onEffectApplied={() => {
              setShallApplyEffect(false);
            }}
            >
            {extendedMesh}
          </Draggable>
      </RemoteLocationController>
    );
  }

  return extendedMesh;
};

export default forwardRef(GenericGeometry);