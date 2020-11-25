const { USER_FOUND, USER_EXPIRING, processSilentRenew, USER_EXPIRED } = require("redux-oidc");
const USER_LOG_OUT = "userLogout";
const GET_PROFILE_SUCCESS = "getProfileSuccess";
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
            state = { ...state, user: null };
            return state;
        case USER_EXPIRED:
            state = { ...state, user: null };
            return state;
        case GET_PROFILE_SUCCESS:
            state = { ...state, profile: action.payload };
            return state;
        default:
            return state;
    }
}

export default authReducer;
export { userLogout, profileSuccess };