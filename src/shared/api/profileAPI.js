const { apiClient } = require("./clients");
const PROFILE_END_POINT = "profile/api/profile/"
const getProfile = (userid)=>{
    return apiClient.get(PROFILE_END_POINT+"getProfile/"+userid||"1")
}
export {getProfile}