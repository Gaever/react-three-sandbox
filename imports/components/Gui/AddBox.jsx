import React, { useEffect } from 'react';
import useStyles from './style';
import {useDraggable} from '../../context';
import {wrapPage} from '../../wrap-page';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';

const ADD_BOX = gql`
  mutation insert_box($position: json, $quaternion: json){
    insert_nodes(objects: {nodes_props_boxes: {data: {position: $position, quaternion: $quaternion}}}) {
      returning {
        id
      }
    }
  }
`;

function AddBox() {
  const classes = useStyles();
  const [addBox, { error }] = useMutation(ADD_BOX);
  const {isDragLocked} = useDraggable();

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  })

  function onClick() {
    if (!isDragLocked) {
      addBox({
        variables: {
          position: JSON.stringify([0,0,10]),
          quaternion: JSON.stringify([0,0,0,1]),
        }
      });
    }
  }

  return (
    <a onClick={onClick}><img className={classes.btn} src="/static/add.svg" /></a>
  );
};

export default wrapPage(AddBox);