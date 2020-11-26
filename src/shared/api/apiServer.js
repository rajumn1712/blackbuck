const { apiClient } = require("./clients");
const FRIENDS_API = "service/api/home/";
const GROUPS_API = "service/api/groups/";
const PROFILE_API = "service/api/profile/";

const getFriendSuggestions = (userid, page, pageSize) => {
    return apiClient.get(FRIENDS_API + `friendsSuggestions/${userid}/${pageSize || 10}/${page * pageSize - pageSize}`)
}
const fetchGroupSuggestions = (userid, page, pageSize) => {
    return apiClient.get(GROUPS_API + `userGroupSuggestions/${userid}/${pageSize || 10}/${page * pageSize - pageSize}`)
}
const fetchProfile = (email) => {
    return apiClient.get(PROFILE_API + "getProfile/" + email)
}
const profileDetail = (userid)=>{
    return apiClient.get(PROFILE_API + "getProfile/" + userid)
}
const fetchUserFriends = (userid)=>{
    return apiClient.get(PROFILE_API + "getUserFriends/" + userid)
}
export { getFriendSuggestions, fetchGroupSuggestions,fetchProfile,profileDetail,fetchUserFriends }