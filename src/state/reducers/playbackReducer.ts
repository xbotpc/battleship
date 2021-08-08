import { ACTIONS } from '../actions';

interface Action {
    type: string,
    payload: any
}

const initialState = {}

const audioReducer = (state = initialState, { type = '', payload }: Action): typeof initialState => {
    switch (type) {
        case ACTIONS.SAMPLE_ACTION:
            return {
                ...state,
                someData: payload.someData
            }

        default:
            return state;
    }
}

export default audioReducer;