const { USER_FOUND, USER_EXPIRING, processSilentRenew, USER_EXPIRED } = require("redux-oidc");
const USER_LOG_OUT = "userLogout";
const GET_PROFILE_SUCCESS = "getProfileSuccess";
const post_Increment = "Increment";
const post_Decrement = 'Decrement';
const UPDATE_SEARCH_VALUE = "updateSearchValue";
const userLogout = () => {
    return {
        type: USER_LOG_OUT
    }
};
const profileSuccess = (info) => {
    return {
        type: GET_PROFILE_SUCCESS,
        payload: info
    }
}
const postUpdation = (info, type) => {
    return {
        type: type,
        payload: info
    }
}
const updateSearchValue = (payload) => {
    return {
        type: UPDATE_SEARCH_VALUE,
        payload
    }
}
let initialState = {
    user: null,
};
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_FOUND:
            state = { ...state, user: action.payload }
            return state;
        case USER_EXPIRING:
            processSilentRenew();
            break;
        case USER_LOG_OUT:
            state = { user: null, profile: null };
            return state;
        case USER_EXPIRED:
            state = { ...state, user: null, profile: null };
            return state;
        case GET_PROFILE_SUCCESS:
            state = { ...state, profile: action.payload };
            return state;
        case post_Increment:
            action.payload.Posts = (action.payload.Posts ? action.payload.Posts : 0) + 1;
            state = { ...state, profile: action.payload };
            return state;
        case post_Decrement:
            action.payload.Posts = action.payload.Posts > 0 ? action.payload.Posts - 1 : 0;
            state = { ...state, profile: action.payload };
            return state;
        case UPDATE_SEARCH_VALUE:
            state = { ...state, search_value: action.payload };
            return state;
        default:
            return state;
    }
}

export default authReducer;
export { userLogout, profileSuccess, postUpdation, updateSearchValue };