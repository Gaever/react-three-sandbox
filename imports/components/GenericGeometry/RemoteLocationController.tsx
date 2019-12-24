import React, { useEffect, forwardRef, useState, useContext, useRef } from 'react';
import { useRender } from 'react-three-fiber';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { useDraggable, context } from '../../context';
import { UPDATE_BOX_LOCATION, ON_UPDATE_BOX_LOCATION } from './gql';
import { useWsBooster, WBPackage, A_ON_LOCATION_UPDATE } from '../ThreeActive/ws-booster';

type LocationUpdatePayload = {
  id: number,
  position: [number, number, number],
  quaternion: [number, number, number, number],
  velocity: [number, number, number],
}

function RemoteLocationController(props, outerRef) {
  const {
    children,
    onPositionChange,
    onQuaternionChange,
    onVelocityChange,
  } = props;

  const {
    userData: {
      id = null,
    } = {}
  } = outerRef.current || {};

  const [isCalm, setIsCalm] = useState(true);
  const [updateLocation] = useMutation(UPDATE_BOX_LOCATION);
  const { data: updatedBoxesData } = useSubscription(ON_UPDATE_BOX_LOCATION, {variables: {id}});
  const { isDragLocked, capturedId, wasCaptured, neverWasBroadcast } = useDraggable();
  const { message, ws, error, isBroadcast } = useWsBooster();
  const { state, setState } = useContext(context);
  
  useEffect(() => {
    if (capturedId) {
      setState({
        ...state,
        wasCaptured: true
      });
    }
  }, [capturedId]);

  useEffect(() => {
    if (isBroadcast && !isDragLocked) {
      setState({
        ...state,
        isDragLocked: true,
        wasCaptured: false,
        neverWasBroadcast: false,
      });
    }
    if (!isBroadcast) {
      setState({
        ...state,
        isDragLocked: false,
      });
    }
  }, [isBroadcast]);

  useEffect(() => {
    if (error) console.error(error);
  }, [error])

  // Update geometry's location on remote location update (i.e. somebody
  // moved object). This function updates state in db.
  // TODO: If local and remote locations are different 
  // local geometry shold reappear at correct position with fading effect 
  useEffect(() => {
    if (!isDragLocked) {
      console.log('updatedBoxesData');
      onRemoteLocationUpdate();
    }
  }, [updatedBoxesData]);

  // 
  useEffect(() => {
    onWsUpdateLocation(message);
  }, [message]);

  // Check if geometry stood still after it was moved.
  // Server state should mutate as soon as it triggered.
  useRender(() => {
    onIsCalmTrigger(isCalm, capturedId);
  }, false, [isCalm, capturedId]);

  // Update remote location as object calm down.
  useEffect(() => {
    console.log('isCalm', isCalm, 'neverWasBroadcast', neverWasBroadcast);
    if (
      (isCalm && !isDragLocked && wasCaptured)
      || (isCalm && neverWasBroadcast)
    ) {
      doUpdateLocation();
    }
  }, [isCalm]);

  function onWsUpdateLocation(message) {
    try {
      const wbPackage: WBPackage = JSON.parse(message);
      if (wbPackage.a === A_ON_LOCATION_UPDATE) {
        const {
          id: updatedId,
          position = null,
          quaternion = null,
          velocity = null,
        } = wbPackage.p;
        
        if (!capturedId && position && quaternion &&  velocity &&  id && id === updatedId) {
          // onPositionChange(position);
          // onQuaternionChange(quaternion);
          onVelocityChange(velocity);
        }
      }
    } catch (e){
      // console.warn('GenericGeometry: ', e, message);
    }
  }

  function getLocationPayload(): LocationUpdatePayload | null {
    const {
      body,
      body: {
        position: {
          x = null, y = null, z = null,
        } = {},
        quaternion: {
          x: qx = null, y: qy = null, z: qz = null, w: qw = null,
        } = {},
        velocity: {
          x: vx = null, y: vy = 0, z: vz = null,
        } = {},
      } = {},
      userData: { id = null } = {},
    } = outerRef.current || {};
  
    if (
      x !== null && y !== null && z !== null &&
      qx !== null && qy !== null && qz !== null && qw !== null &&
      id !== null
    ) {
      return {
        id,
        position: [x, y, z],
        quaternion: [qx, qy, qz, qw],
        velocity: [vx, vy, vz],
      };
    }

    return null;
  }

  function doUpdateLocation() {
    const payload: LocationUpdatePayload = getLocationPayload();
    if (payload !== null) {
      const { id, position, quaternion } = payload;
      updateLocation({
        variables: {
          id,
          position: JSON.stringify(position),
          quaternion: JSON.stringify(quaternion),
        }
      });
    }
  }

  function onIsCalmTrigger(isCalm, capturedId) {
    const {
      body: {
        velocity: {
          x = 0, y = 0, z = 0,
        } = {},
      } = {},
    } = outerRef.current || {};

    const isCalmed = (
      Math.abs(Math.round(x*100)/100) === 0
      && Math.abs(Math.round(y*100)/100) === 0
      && Math.abs(Math.round(z*100)/100) === 0
    );
    
    if (isCalm !== isCalmed) setIsCalm(isCalmed);
    
    // Update remote object location smoothless
    // while client is dragging it
    // if (capturedId && capturedId === id) {
    if (capturedId && !isCalmed || (capturedId && capturedId === id)) {
      const payload = getLocationPayload();
      const wbPackage: WBPackage = {
        a: A_ON_LOCATION_UPDATE,
        p: payload
      };
      // console.log('payload', payload);
      try {
        payload && ws && ws.send(JSON.stringify(wbPackage));
      } catch (e) {
        console.error(e);
      }
    }
  }

  function onRemoteLocationUpdate() {
    const { node = [] } = updatedBoxesData || {};
    const { rawBox = [] } = node.length && node[0] || {};
    const { position = null, quaternion = null } = rawBox.length && rawBox[0] || {};

    if (!capturedId && position && quaternion) {
      onPositionChange(JSON.parse(position));
      onQuaternionChange(JSON.parse(quaternion));
    }
  }  

  return <>{children}</>;
}

export default forwardRef(RemoteLocationController);
