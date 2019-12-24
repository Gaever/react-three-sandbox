import React, {useState, useEffect} from 'react';
import Box from '../geometry/Box';
import Plane from '../geometry/Plane';
import {useGql} from '../../use-gql';
import {FETCH_BOXES} from './gql';

export default function SceneObjects() {
  const [boxes, setBoxes] = useState([]);
  const {data, error} = useGql(FETCH_BOXES);
  const { rawBoxes = [] } = data;

  useEffect(() => {
    if (error) {
      //console.error(error)
    }
  }, [error]);
  
  useEffect(() => {
    if (
      (boxes.length === 0)
      || (
        boxes.length > 0
        && rawBoxes.length > 0
        && (boxes.length !== rawBoxes.length)
      )
    ) {
      setBoxes(rawBoxes.map(({ position, quaternion, id, capturedBySessionId }) => {
        const parsedPosition = JSON.parse(position);
        const parsedQuaternion = JSON.parse(quaternion);
        if (!Array.isArray(parsedPosition) || !Array.isArray(parsedQuaternion) || !id ) {
          return null;
        }

        return (
          <Box
            key={id}
            capturedBySessionId={capturedBySessionId}
            userData={{id}}
            position={parsedPosition}
            quaternion={parsedQuaternion}
            draggable
          />
        );
      }));
    }
  
    return () => {
      setBoxes([]);
    }
  }, [rawBoxes.length]);

  return (
    <>
      <Plane position={[0, 0, 0]} />
      {boxes}
    </>
  );
}
