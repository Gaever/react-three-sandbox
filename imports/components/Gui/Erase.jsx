import React, { useEffect } from 'react';
import useStyles from './style';
import {wrapPage} from '../../wrap-page';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {useDraggable} from '../../context';

const ERASE = gql`
  mutation {
    delete_nodes_props_boxes(where: {}) {
      returning {
        id
      }
    }
  }
`;

function Erase() {
  const classes = useStyles();
  const [erase, { error }] = useMutation(ERASE);
  const {isDragLocked} = useDraggable();

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  })

  function onClick() {
    if (!isDragLocked) erase();
  }

  return (
    <a onClick={onClick}><img className={classes.btn} src="/static/erase.svg" /></a>
  );
};

export default wrapPage(Erase);
