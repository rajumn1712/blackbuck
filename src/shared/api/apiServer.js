import firebase from 'firebase';
import 'firebase/messaging';
import 'firebase/firestore'
const { apiClient, cloudMessaging } = require("./clients");
const FRIENDS_API = "service/api/home/";
const GROUPS_API = "service/api/groups/";
const PROFILE_API = "service/api/profile/";
const TAGS_API = "service/api/posts/";
const ADMIN_API = "service/api/admin/";
const LMS_API = "service/api/LMS/";
const CAREESRS_API = "service/api/careers/";
const getFriendSuggestions = (userid, page, pageSize) => {
  return apiClient.get(
    FRIENDS_API +
    `friendsSuggestions/${userid}/${pageSize || 10}/${page * pageSize - pageSize
    }`
  );
};
const fetchGroupSuggestions = (userid, page, pageSize) => {
  return apiClient.get(
    GROUPS_API +
    `userGroupSuggestions/${userid}/${pageSize || 10}/${page * pageSize - pageSize
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
const saveGroupImage = (group_id, type, obj) => {
  return apiClient.post(PROFILE_API + `updateGroupPics/${group_id}/${type}`, obj);
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
const fetchTags = (user_id, take, skip) => {
  return apiClient.get(TAGS_API + `getTags/${user_id}/${take}/${skip}`);
};
const fetchInterestsLu = (take, skip) => {
  return apiClient.get(PROFILE_API + `getAllInterests/${take}/${skip}`);
};
const fetchCourseSuggestions = (user_id, take, skip) => {
  return apiClient.get(
    PROFILE_API + `getCourseSuggestions/${user_id}/${take}/${skip}`
  );
};
const usercourseSuggestions = (user_id, take, skip) => {
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
const getAdminInvites = (userid, page, pageSize) => {
  return apiClient.get(
    PROFILE_API +
    `getAdminInvitations/${userid}/${pageSize || 1}/${page * pageSize - pageSize
    }`
  );
};
const acceptDeclinePrivateInvites = (groupid, memberid, requesttype) => {
  return apiClient.get(
    PROFILE_API + `adminAcceptInvitation/${groupid}/${memberid}/${requesttype}`
  );
};
const getColleges = () => {
  return apiClient.get(FRIENDS_API + "getAllColleges/1000/0");
};
const getCollegeBranches = (college_id) => {
  return apiClient.get(FRIENDS_API + `getBranches`);
};
const getBranchSubjects = (college_id, branch_id) => {
  return apiClient.get(FRIENDS_API + `getSubjectsByBranchId/${branch_id}`);
};
const saveGroup = (obj) => {
  return apiClient.post(GROUPS_API + `saveGroup`, obj);
};
const getUserInvitations = (user_id, take, skip) => {
  return apiClient.get(
    FRIENDS_API + `userInvitations/${user_id}/${take}/${skip}`
  );
};
const acceptDeclineInvitations = (obj) => {
  return apiClient.post(FRIENDS_API + `invitationAcceptandDecline`, obj);
};
const editGroup = (group_id, userid, type) => {
  let method = type ? 'getGroupViewDetails' : 'getGroupDetails'
  return apiClient.get((type ? PROFILE_API : FRIENDS_API) + `${method}/${group_id}/${userid}`);
};
const fetchInerests = () => {
  return apiClient.get(FRIENDS_API + "getInterests");
};
const saveOnboard = (object, method) => {
  return apiClient.post(FRIENDS_API + (method ? method : "saveUserInfo"), object);
};
const getAdminFriends = (user_id, groupid) => {
  return apiClient.get(PROFILE_API + `getAdminFriends/${groupid}/${user_id}`);
};
const saveInvitations = (object) => {
  return apiClient.post(PROFILE_API + "adminInvitationsRequests", object);
};
const getMedia = (groupId, type, take, skip) => {
  return apiClient.get(PROFILE_API + `getGroupPhotos/${groupId}/${take}/${skip}/${type}`);
};
const getMembers = (groupId, userId, take, skip) => {
  return apiClient.get(PROFILE_API + `getGroupMembers/${groupId}/${userId}/${take}/${skip}`);
}
const deleteUserGroup = (group_id) => {
  return apiClient.get(PROFILE_API + `groupDelete/${group_id}`);
};
const saveAdminUsers = (object) => {
  return apiClient.post(PROFILE_API + "saveGroupAdminUsers", object);
};
const fetchUserColleges = () => {
  return apiClient.get(FRIENDS_API + "getColleges");
};

const getNotifications = (userId, take, skip) => {
  return apiClient.get(PROFILE_API + `getNotifications/${userId}/${take}/${skip}`);
};
const unFriend = (user_id, friend_id) => {
  return apiClient.get(PROFILE_API + `deleteFriend/${user_id}/${friend_id}`)
}
const fetchNotificationCount = (userId) => {
  return apiClient.get(PROFILE_API + `getNotificationsCount/${userId}`);
};
const certifiedCourses = (user_id) => {
  return apiClient.get(PROFILE_API + `getCertifiedCourses/${user_id}`);
}
const saveUserPassword = (object) => {
  return apiClient.post(process.env.REACT_APP_AUTHORITY + "/Account/ChangePassword", object);
};
const getAuthors = () => {
  return apiClient.get(ADMIN_API + "getAuthors/1000/0");
};
const saveTopic = (obj, courseId, secId) => {
  return apiClient.post(ADMIN_API + "saveTopic" + `/${courseId}/${secId}`, obj);
}
const sectionDeletion = (courseId, secId) => {
  return apiClient.get(ADMIN_API + "deleteSection" + `/${courseId}/${secId}`);
}
const saveSection = (obj, courseId) => {
  return apiClient.post(ADMIN_API + "saveSection" + `/${courseId}`, obj);
}
const saveCourse = (obj) => {
  return apiClient.post(ADMIN_API + "saveCourse", obj);
}
const getCourse = (courseId, user_id) => {
  return apiClient.get(ADMIN_API + "getCourse" + `/${courseId}/${user_id}`);
}
const publishCourse = (obj, isPublish) => {
  let method = isPublish ? "updateCoursePosts" : "coursePublish";
  return apiClient.post(ADMIN_API + `${method}`, obj);
}
const getUsers = (userId, take, skip) => {
  return apiClient.get(ADMIN_API + `getUsers/${userId}/${take}/${skip}`);
}
const getUsersCount = () => {
  return apiClient.get(ADMIN_API + `getUsersCount`);
}
const getGroups = (userId, take, skip) => {
  return apiClient.get(ADMIN_API + `getAdminCourses/${userId}/${take}/${skip}`);
}
const courseDelete = (GroupId) => {
  return apiClient.get(ADMIN_API + `courseDelete/${GroupId}`);
}
const setScholor = (userId) => {
  return apiClient.get(ADMIN_API + `setIsScholar/${userId}`);
}
const getCoursesRelCount = (user_id) => {
  return apiClient.get(ADMIN_API + `getCoursesCount/${user_id}`);
}
const getSystemGroups = (user_id) => {
  return apiClient.get(ADMIN_API + `getSystemGroups/${user_id}`);
}
const setSystemAdmin = (user_id, category) => {
  return apiClient.get(ADMIN_API + `setAsAdmin/${user_id}/${category}`);
}
const submitDocs = (obj) => {
  return apiClient.post(ADMIN_API + "saveTests", obj);
}
const getSubmissions = (user_id) => {
  return apiClient.get(ADMIN_API + `getSubmitTests/${user_id}`);
}
const certipyRejectDocument = (Id, type) => {
  return apiClient.get(ADMIN_API + `CertifiedOrReject/${Id}/${type}`);
}
const topicDelete = (courseId, sectionId, Id) => {
  return apiClient.get(ADMIN_API + `deleteTopic/${courseId}/${sectionId}/${Id}`);
}
const getAllSystemGroups = (take, skip) => {
  return apiClient.get(ADMIN_API + `getAllSystemGroups/${take}/${skip}`);
}
const groupBlock = (obj) => {
  return apiClient.post(ADMIN_API + `saveGroupBlocked`, obj);
}
const joinGroupNew = (id, obj) => {
  return apiClient.post(LMS_API + "joinCourse/" + id, obj);
}
const getPublishedObject = (courseId) => {
  return apiClient.get(ADMIN_API + `getPostsByCoureId/${courseId}`,);
}
const saveJobPost = (obj) => {
  return apiClient.post(ADMIN_API + 'saveJobPosting', obj);
}
const getJobPostings = (user_id, take, skip) => {
  return apiClient.get(ADMIN_API + `getAllJobPostings/${user_id}/${take}/${skip}`);
}
const getJobById = (user_id, id) => {
  return apiClient.get(ADMIN_API + `getJobPostById/${user_id}/${id}`)
}
const jobpostingsCount = () => {
  return apiClient.get(ADMIN_API + 'getJobPostingCount');
}
const getJobApplications = (user_id, take, skip) => {
  return apiClient.get(ADMIN_API + `getJobApplications/${user_id}/${take}/${skip}`)
}
const jobApplicationCount = () => {
  return apiClient.get(ADMIN_API + 'getJobApplicationCount');
}
const getScholorUsers = (take, skip) => {
  return apiClient.get(ADMIN_API + `getScholorUsers/${take}/${skip}`);
}
const allJobPostings = (user_id, take, skip, type, state, city) => {
  if (type === 'jobsearch' && (state || city)) {
    return apiClient.get(CAREESRS_API + `getSearchJobPostings/${user_id}/${state ? state : null}/${city ? city : null}/${take}/${skip}`)
  } else if (type === 'savedjobs') {
    return apiClient.get(CAREESRS_API + `getUserSavedJobPosts/${user_id}/${take}/${skip}`);
  }
  else {
    return apiClient.get(CAREESRS_API + `getAllJobPostings/${user_id}/${take}/${skip}`);
  }
}
const saveApplicationJob = (obj) => {
  return apiClient.post(CAREESRS_API + 'saveJobApplication', obj);
}
const saveUserJobPost = (obj) => {
  return apiClient.post(CAREESRS_API + 'savedJobPosts', obj);
}
const getSavedJobPost = (user_id, take, skip) => {
  return apiClient.get(CAREESRS_API + `getUserSavedJobPosts/${user_id}/${take}/${skip}`);
}
const deleteJobSavedPost = (id) => {
  return apiClient.get(CAREESRS_API + `deleteSavedJobPost/${id}`);
}
const deleteJobPost = (id) => {
  return apiClient.get(ADMIN_API + `deleteJobPost/${id}`);
}
const getIsFriend = (id, fnd_user_id) => {
  return apiClient.get(PROFILE_API + `CheckIsFriend/${id}/${fnd_user_id}`);
}
const getCategories = () => {
  return apiClient.get(LMS_API + `getCategoriesLu`);
}
const saveNotification = (obj) => {
  return apiClient.post(PROFILE_API + `saveNotification`, obj);
}
const readNotification = (id, type) => {
  return apiClient.get(PROFILE_API + `notificationRead/${id}/${type}`);
}
const sendNotification = ({ to, message, from, type }) => {
  firebase.firestore().collection("devices").doc(to).collection('tokens')
    .get()
    .then(snapshot => {
      let devices = snapshot.docs.map(item => item.data().token);
      devices = devices.filter((item, indx, arra) => indx == arra.indexOf(item));
      const obj = {
        data: { user_id: from, type },
        notification: {
          title: "Blackbuck",
          icon: "https://theblackbucks.com/assets-new/img/logo.png",
          body: message
        },
        registration_ids: devices
      }
      if (devices && devices.length > 0) {
        cloudMessaging.post("fcm/send", obj).then(response => {

        });
      }
    });
}
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
  saveGroupImage,
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
  usercourseSuggestions,
  saveInterest,
  deleteInterest,
  getUserCourses,
  getAdminInvites,
  acceptDeclinePrivateInvites,
  getColleges,
  getCollegeBranches,
  getBranchSubjects,
  saveGroup,
  getUserInvitations,
  acceptDeclineInvitations,
  editGroup,
  fetchInerests,
  saveOnboard,
  getAdminFriends,
  saveInvitations,
  getMedia,
  getMembers,
  deleteUserGroup,
  saveAdminUsers,
  fetchUserColleges,
  getNotifications,
  unFriend,
  fetchNotificationCount,
  certifiedCourses,
  saveUserPassword,
  getAuthors,
  saveTopic,
  sectionDeletion,
  saveSection,
  saveCourse,
  getCourse,
  publishCourse,
  getUsers,
  getUsersCount,
  getGroups,
  courseDelete,
  setScholor,
  getCoursesRelCount,
  getSystemGroups,
  setSystemAdmin,
  submitDocs,
  getSubmissions,
  certipyRejectDocument,
  topicDelete,
  getAllSystemGroups,
  groupBlock,
  joinGroupNew,
  getPublishedObject,
  saveJobPost,
  getJobPostings,
  getJobById,
  jobpostingsCount,
  getJobApplications,
  jobApplicationCount,
  getScholorUsers,
  allJobPostings,
  saveApplicationJob,
  saveUserJobPost,
  getSavedJobPost,
  deleteJobSavedPost,
  deleteJobPost,
  getIsFriend,
  getCategories,
  saveNotification,
  readNotification,
  sendNotification
};
