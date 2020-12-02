const { USER_FOUND, USER_EXPIRING, processSilentRenew, USER_EXPIRED } = require("redux-oidc");
const USER_LOG_OUT = "userLogout";
const GET_PROFILE_SUCCESS = "getProfileSuccess";
const post_Deletion = "postDeletion";
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
const postDeletion = (info) => {
    return {
        type: post_Deletion,
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
            state = {user: null,profile:null };
            return state;
        case USER_EXPIRED:
            state = { ...state, user: null,profile:null };
            return state;
        case GET_PROFILE_SUCCESS:
            state = { ...state, profile: action.payload };
            return state;
        case post_Deletion:
            action.payload.Posts = action.payload.Posts > 0 ? action.payload.Posts - 1 : 0;
            state = { ...state, profile: action.payload };
            return state;
        default:
            return state;
    }
}

export default authReducer;
export { userLogout, profileSuccess,postDeletion };