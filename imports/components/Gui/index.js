import React, {useEffect} from 'react';
import useStyles from './style';
import AddBox from './AddBox';
import Erase from './Erase';
import IsDradLockedIndicator from './IsDragLockedIndicator';

export default function Gui() {
    const classes = useStyles();

    return (
        <div className={classes.gui}>
            <AddBox />
            <Erase />
            <IsDradLockedIndicator />
        </div>
    );
};
