import React from 'react';
import {useDraggable} from '../../context';
import useStyles from './style';

export default function IsDradLockedIndicator() {
  const classes = useStyles();
  const {isDragLocked = false} = useDraggable();

  if (!isDragLocked) return null;

  return (
    <img className={classes.btn} src="/static/lock.svg" />
  );
};
