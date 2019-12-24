import React, { useState, useRef, useReducer, useContext } from 'react';
import { defaultState as defaultReducerState, reducer } from './reducer';

export const context = React.createContext();

export function useDraggable() {
    const { 
        state: {
            jointBodyPoint,
            mouseConstraint,
            showClickMaker,
            capturedId,
            isDragLocked,
            wasCaptured,
            neverWasBroadcast,
        },
        gplaneRef,
        jointBodyRef,
    } = useContext(context);

     return {
        capturedId,
        jointBodyPoint,
        jointBodyRef,
        gplaneRef,
        mouseConstraint,
        showClickMaker,
        isDragLocked,
        wasCaptured,
        neverWasBroadcast
    };
}

export function useSceneReducer() {
    const { reducerState, dispatch } = useContext(context);

    return [reducerState, dispatch];
}

export default function Provider({ children }) {
    const defaultState = {
        jointBodyPoint: undefined,
        mouseConstraint: undefined,
        showClickMaker: false,
        capturedId: null,
        sessionId: null,
        isDragLocked: false,
        wasCaptured: false,
        neverWasBroadcast: true,
    };
    const [state, setState] = useState(defaultState);
    const [reducerState, dispatch] = useReducer(reducer, defaultReducerState);
    const orbitControlRef = useRef();
    const jointBodyRef = useRef();
    const gplaneRef = useRef();

    return (
        <context.Provider
            value={{
                state,
                setState,
                reducerState,
                dispatch,
                orbitControlRef,
                jointBodyRef,
                gplaneRef,
            }} 
            children={children}
        />
    );
}
