const { apiClient } = require("./clients");
const FRIENDS_API = "service/api/home/";
const GROUPS_API = "service/api/groups/";
const PROFILE_API = "service/api/profile/";
const TAGS_API = "service/api/posts/";

const getFriendSuggestions = (userid, page, pageSize) => {
  return apiClient.get(
    FRIENDS_API +
      `friendsSuggestions/${userid}/${pageSize || 10}/${
        page * pageSize - pageSize
      }`
  );
};
const fetchGroupSuggestions = (userid, page, pageSize) => {
  return apiClient.get(
    GROUPS_API +
      `userGroupSuggestions/${userid}/${pageSize || 10}/${
        page * pageSize - pageSize
      }`
  );
};
const fetchProfile = (email) => {
  return apiClient.get(PROFILE_API + "getProfile/" + email);
};
const profileDetail = (userid) => {
  return apiClient.get(PROFILE_API + "getProfileDetail/" + userid);
};
const fetchUserFriends = (userid) => {
  return apiClient.get(PROFILE_API + "getUserFriends/" + userid);
};
const sendFirendRequest = (user_id, object) => {
  return apiClient.post(FRIENDS_API + `savefriendRequest/${user_id}`, object);
};
const acceptFrienRequest = (user_id, friend_id, type, obj) => {
  return apiClient.post(
    FRIENDS_API + `saveAcceptAndDecline/${user_id}/${friend_id}/${type}`,
    obj
  );
};
const fetchFriendRequests = (user_id) => {
  return apiClient.get(PROFILE_API + "getFriendRequests/" + user_id);
};
const saveProfileImage = (user_id, type, obj) => {
  return apiClient.post(PROFILE_API + `saveProfilePic/${user_id}/${type}`, obj);
};
const saveAboutMe = (obj) => {
  return apiClient.post(PROFILE_API + `saveAboutMe`, obj);
};
const saveInternships = (obj) => {
  return apiClient.post(PROFILE_API + `saveInternships`, obj);
};
const deleteinternship = (id, user_id) => {
  return apiClient.get(PROFILE_API + `deleteInternship/${id}/${user_id}`);
};
const saveVideoAsProfile = (obj) => {
  return apiClient.post(PROFILE_API + `saveVideoAsProfile`, obj);
};
const saveHobbies = (user_id, obj) => {
  return apiClient.post(PROFILE_API + `saveHobbies/${user_id}`, obj);
};
const saveEducation = (obj) => {
  return apiClient.post(PROFILE_API + `saveEducation`, obj);
};
const cancelFriendRequest = (user_id, friend_id) => {
  return apiClient.get(FRIENDS_API + `cancelRequest/${user_id}/${friend_id}`);
};
const joinGroup = (group_id, obj) => {
  return apiClient.post(FRIENDS_API + "joinGroup/" + group_id, obj);
};
const cancelGroupRequest = (group_id, user_id) => {
  return apiClient.get(FRIENDS_API + `cancelJoinGroup/${group_id}/${user_id}`);
};
const fetchUserGroups = (user_id, take, skip) => {
  return apiClient.get(GROUPS_API + `getUserGroups/${user_id}/${take}/${skip}`);
};
const fetchTags = (take, skip) => {
  return apiClient.get(TAGS_API + `getTags/${take}/${skip}`);
};
const fetchInterestsLu = (take, skip) => {
  return apiClient.get(PROFILE_API + `getAllInterests/${take}/${skip}`);
};
const fetchCourseSuggestions = (user_id, take, skip) => {
  return apiClient.get(
    PROFILE_API + `userCourseSuggestions/${user_id}/${take}/${skip}`
  );
};
const saveInterest = (object) => {
  return apiClient.post(PROFILE_API + "saveInterests", object);
};
const deleteInterest = (user_id, interest_id) => {
  return apiClient.get(
    PROFILE_API + `deleteInterest/${interest_id}/${user_id}`
  );
};
const getUserCourses = (user_id, take, skip) => {
  return apiClient.get(
    PROFILE_API + `getUserCourses/${user_id}/${take}/${skip}`
  );
};
export {
  getFriendSuggestions,
  fetchGroupSuggestions,
  fetchProfile,
  profileDetail,
  fetchUserFriends,
  sendFirendRequest,
  acceptFrienRequest,
  fetchFriendRequests,
  saveProfileImage,
  saveAboutMe,
  saveInternships,
  deleteinternship,
  saveVideoAsProfile,
  saveHobbies,
  saveEducation,
  cancelFriendRequest,
  joinGroup,
  cancelGroupRequest,
  fetchUserGroups,
  fetchTags,
  fetchInterestsLu,
  fetchCourseSuggestions,
  saveInterest,
  deleteInterest,
  getUserCourses,
};
