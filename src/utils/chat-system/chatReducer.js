const SET_UNREAD = "setUnRead";
const REMOVE_UNREAD = "removeUnRead";
const setUnRead = (payload) => {
    return {
        type: SET_UNREAD,
        payload
    }
}
const removeUnRead = (payload) => {
    return {
        type: REMOVE_UNREAD,
        payload
    }
}
const initialState = {
    unread: []
}
const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_UNREAD:
            let _data = [...state.unread];
            const idx = _data.indexOf(action.payload);
            if (idx == -1) {
                _data.push(action.payload);
            }
            state = { ...state, unread: _data };
            return state;
        case REMOVE_UNREAD:
            let data = [...state.unread];
            const _idx = data.indexOf(action.payload);
            if (_idx > -1) {
                data.splice(_idx, 1);
            }
            state = { ...state, unread: data };
        default:
            return state;
    }
}
export { setUnRead, removeUnRead }
export default chatReducer