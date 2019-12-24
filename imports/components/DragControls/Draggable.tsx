import React, { useContext, useState, useEffect, forwardRef } from 'react';
import { useWorld, useCannon } from '../../use-cannon';
import * as CANNON from 'cannon';
import { useOrbit } from '../../components/OrbitControls';
import { context, useDraggable } from '../../context';
import { GENERIC_ID } from '../GenericGeometry';

function Draggable(props, outerRef) {
  const {
    children,
    position = [0, 0, 0],
    quaternion = [0, 0, 0, 1],
    velocity = [0,0,0],
    mass,
    capturedBySessionId = null,
    shallApplyEffect,
    onEffectApplied,
  } = props;
  const { state, setState } = useContext(context);
  const world = useWorld();
  const orbit = useOrbit();
  // Create rigid body with mass
  const cannonRef = useCannon({ mass }, body => {
    const { bodyShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)) } = props;
    body.addShape(bodyShape);
    body.position.set(...position);
    outerRef.current.body = body;
  }, [], outerRef);

  const { state: { sessionId = null } = {} } = useContext(context);

  function getObjectId() {
    const {
      userData: {
        id = GENERIC_ID,
      } = {},
    } = outerRef.current || {};

    return id;
  }

  // When outer 'position' is changed, update rigid body's coordinates
  useEffect(() => {
    if (cannonRef.current && cannonRef.current.body) {
      cannonRef.current.body.position.set(...position);
    }
  }, [position[0], position[1], position[2]]);

  useEffect(() => {
    if (cannonRef.current && cannonRef.current.body) {
      cannonRef.current.body.quaternion.set(...quaternion);
    }
  }, [quaternion[0], quaternion[1], quaternion[2], quaternion[3]]);

  useEffect(() => {
    if (cannonRef.current && cannonRef.current.body) {
      cannonRef.current.body.velocity.set(...velocity);
    }
  }, [velocity[0], velocity[1], velocity[2], velocity[3]]);


  const {
    jointBodyRef,
    // Global capture flag used in DragControls component
    capturedId,
    isDragLocked,
  } = useDraggable();
  // Local capture flag.
  // Implemented to avoid conflict between setting "captured" global state 
  // variable and checking it's alternation in useEffect
  const [ allowRelease, setAllowRelease ] = useState(true);

  useEffect(() => {
    window.addEventListener('mouseup', () => {
        setAllowRelease(true);
    });
  }, []);

  useEffect(() => {
    if (capturedId && allowRelease) {
      orbit.enabled = true;
      world.removeConstraint(state.mouseConstraint);
      setState({
        ...state,
        showClickMaker: false,
        mouseConstraint: undefined,
        capturedId: null,
      });
    }
  }, [allowRelease]);

  function addMouseConstraint(point) {
    const constrainedBody = cannonRef.current.body;
    if (!constrainedBody || capturedId) return;
    
    const { x, y, z } = point;
    // Vector to the clicked point, relative to the body
    const v1 = new CANNON.Vec3(x,y,z).vsub(constrainedBody.position);

    // Apply anti-quaternion to vector to tranform it into the local body coordinate system
    const antiRot = constrainedBody.quaternion.inverse();
    const pivot = antiRot.vmult(v1); // pivot is not in local body coordinates

    // const jointBody = getBody(jointBodyRef.current.uuid);
    const jointBody = jointBodyRef.current.body;
    jointBody.position.set(x,y,z);

    // Create a new constraint
    // The pivot for the jointBody is zero
    const mouseConstraint = new CANNON.PointToPointConstraint(constrainedBody, pivot, jointBody, new CANNON.Vec3(0,0,0));
    
    // Add the constriant to world
    world.addConstraint(mouseConstraint);

    setState({
      ...state,
      // Move the cannon click marker particle to the click position
      jointBodyPoint: point,
      mouseConstraint,
      showClickMaker: true,
      capturedId: getObjectId(),
    });
  }

  const extendedProps = Object.assign(
    {},
    {
      ref: cannonRef,
      onClick: (event) => {
        // console.log('onClick', event);
      },
      onPointerUp: (event) => {
        // console.log('onPointerUp', event);
      },
      onPointerDown: event => {
        // console.log('onPointerDown');
        if (
          capturedId
          || isDragLocked
          || (
            capturedBySessionId
            && capturedBySessionId === sessionId
          )
        ) {
          return;
        }
        // console.log('disableing orbit');
        orbit.enabled = false;
        
        setAllowRelease(false);
        addMouseConstraint(event.point);

        (
          props.onCapturedPointerDown
          && typeof props.onCapturedPointerDown === 'function'
          && props.onCapturedPointerDown(event)
        );
      },
      onPointerMove: event => {
        // console.log('onPointerMove')
        if (!capturedId || isDragLocked) return;
        // console.log('onPointerMove capturedId', capturedId);

        setState({
            ...state,
            jointBodyPoint: event.point,
            showClickMaker: true,
        });
      },
      ...props
    },
  );
  const draggableMesh = React.cloneElement(children, extendedProps);

  return draggableMesh;
}

export default forwardRef(Draggable);
