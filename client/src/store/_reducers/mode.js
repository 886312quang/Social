import produce from "immer";

const initialState = {
    scheme: false,
    rtl: false
}

// Mutations/Reducer
const modeReducer = (state = initialState, { type, payload }) =>
    produce(state, (draft) => {
        switch (type) {
            case 'DARKMODE':
                return Object.assign({}, state, {
                    scheme: payload
                })
            case 'DIRMODE':
                return Object.assign({}, state, {
                    rtl: payload
                })
            default:
                return state
        }
    });



export default modeReducer;
