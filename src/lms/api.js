import { apiClient } from "../shared/api/clients";
const PROFILE_REMOTE = "/service/api/profile/";
const ADMIN_REMOTE = "/service/api/admin/";
const LMS_REMOTE = "/service/api/LMS/";

const fetchUserCourses = (user_id, page, pageSize, key) => {
  const method = key === "courses" ? "getUserCourses" : "getRecentCourses";
  const remote = key === "courses" ? PROFILE_REMOTE : ADMIN_REMOTE;
  return apiClient.get(
    remote + `${method}/${user_id}/${pageSize}/${page * pageSize - pageSize}`
  );
};
const fetchCourseSuggestions = (user_id, page, pageSize) => {
  return apiClient.get(
    PROFILE_REMOTE +
      `getCourseSuggestions/${user_id}/${pageSize}/${
        page * pageSize - pageSize
      }`
  );
};
const fetchCourseDetails = (id) => {
  return apiClient.get(ADMIN_REMOTE + `getCourse/${id}`);
};
const lmsJoinCourse = (course_id, obj) => {
  return apiClient.post(LMS_REMOTE + "joinCourse/" + course_id, obj);
};
const fetchUserTests = (course_id, user_id) => {
  return apiClient.get(LMS_REMOTE + `getUserTests/${course_id}/${user_id}`);
};
const submitTests = (obj) => {
  return apiClient.post(LMS_REMOTE + "submitTests", obj);
};
const saveLMSComment = (obj) => {
  return apiClient.post(LMS_REMOTE + "saveComment", obj);
};
const fetchLMSComments = (user_id, take, skip) => {
  return apiClient.get(
    LMS_REMOTE + `getComments/${user_id}/${take || 10}/${skip}`
  );
};
export {
  fetchUserCourses,
  fetchCourseSuggestions,
  fetchCourseDetails,
  lmsJoinCourse,
  fetchUserTests,
  submitTests,
  saveLMSComment,
  fetchLMSComments,
};
