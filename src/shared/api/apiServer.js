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
const profileDetail = (userid) => {
    return apiClient.get(PROFILE_API + "getProfileDetail/" + userid)
}
const fetchUserFriends = (userid) => {
    return apiClient.get(PROFILE_API + "getUserFriends/" + userid)
}
const sendFirendRequest = (user_id, object) => {
    return apiClient.post(FRIENDS_API + `savefriendRequest/${user_id}`, object);
}
const acceptFrienRequest = (user_id, friend_id) => {
    return apiClient.get(FRIENDS_API+`savefriendRequestAccept/${user_id}/${friend_id}`)
}   
export { getFriendSuggestions, fetchGroupSuggestions, fetchProfile, profileDetail, fetchUserFriends,sendFirendRequest,acceptFrienRequest }