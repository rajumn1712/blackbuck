import { apiClient } from "../shared/api/clients"
const PROFILE_REMOTE = "/service/api/profile/"
const ADMIN_REMOTE = "/service/api/admin/"

const fetchUserCourses = (user_id, page, pageSize) => {
    return apiClient.get(PROFILE_REMOTE + `getUserCourses/${user_id}/${pageSize}/${page * pageSize - pageSize}`)
}
const fetchCourseSuggestions = (user_id, page, pageSize) => {
    return apiClient.get(PROFILE_REMOTE + `getCourseSuggestions/${user_id}/${pageSize}/${page * pageSize - pageSize}`)
}
export { fetchUserCourses,fetchCourseSuggestions }