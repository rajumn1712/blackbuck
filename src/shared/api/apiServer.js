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
const acceptFrienRequest = (user_id, friend_id, type, obj) => {
    return apiClient.post(FRIENDS_API + `saveAcceptAndDecline/${user_id}/${friend_id}/${type}`, obj)
}
const fetchFriendRequests = (user_id) => {
    return apiClient.get(PROFILE_API + "getFriendRequests/" + user_id)
}
const saveProfileImage = (user_id, type, obj) => {
    return apiClient.post(PROFILE_API + `saveProfilePic/${user_id}/${type}`, obj)
}
const saveInnternship = (user_id, obj) => {
    return apiClient.post(PROFILE_API + `saveProfilePic/${user_id}`, obj)
}
const saveEducation = (user_id, obj) => {
    return apiClient.post(PROFILE_API + `saveProfilePic/${user_id}`, obj)
}
const cancelFriendRequest = (user_id, friend_id) => {
    return apiClient.get(FRIENDS_API + `cancelRequest/${user_id}/${friend_id}`)
}
const joinGroup = (group_id, obj) => {
    return apiClient.post(FRIENDS_API + "joinGroup/" + group_id, obj);
}
const cancelGroupRequest = (group_id, user_id) => {
    return apiClient.get(FRIENDS_API + `cancelJoinGroup/${group_id}/${user_id}`)
}
export { getFriendSuggestions, fetchGroupSuggestions, fetchProfile, profileDetail, fetchUserFriends, sendFirendRequest, acceptFrienRequest, fetchFriendRequests, saveProfileImage, saveInnternship, saveEducation, cancelFriendRequest, joinGroup,cancelGroupRequest }