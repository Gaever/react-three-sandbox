export const defaultState = {
    sceneObjects: {},
    tmpObjects: [],
};

export const A_ADD_TMP_OBJECT = 'A_ADD_TMP_OBJECT';
export const A_REMOVE_TMP_OBJECT = 'A_REMOVE_TMP_OBJECT';

export function reducer(state, action) {
    const {
        payload = {},
        type = undefined,
    } = action;

    switch (type) {
        case A_ADD_TMP_OBJECT: {
            const {
                box = null,
            } = payload;

            return {
                ...state,
                tmpObjects: [
                    ...state.tmpObjects,
                    box,
                ],
            };
        }

        case A_REMOVE_TMP_OBJECT: {
            const {
                key,
            } = payload;

            if (!state.tmpObjects[key]) return state;

            const newState = { ...state };
            delete newState.tmpObjects[key];

            return newState;
        }

        default: return state;
    }
}
