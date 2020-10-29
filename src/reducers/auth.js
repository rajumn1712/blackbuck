const { USER_FOUND, USER_EXPIRING, processSilentRenew } = require("redux-oidc");

const USER_LOG_OUT = "userLogout";

const userLogout = () => {
    return {
        type: USER_LOG_OUT
    }
};
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
        default:
            return state;
    }
}

export default authReducer;
export { userLogout };