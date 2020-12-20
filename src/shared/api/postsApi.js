import { apiClient } from './clients';
const POSTS_END_POINT = "service/api/posts/";
const PROFILE_END_POINT = "service/api/profile/"
const getPosts = (userid, pageNo, pageSize, postingsType, groupid, post_id) => {
    const method = {
        "all": "getAllPosts",
        "user": "getUsersPosts",
        "saved": "getUserSavedPosts",
        "group": "getGroupPosts"
    }
    if (postingsType === "single") {
        return getPostDetails(post_id, userid)
    } else {
        const endPoint = postingsType === "saved" || postingsType === "group" ? PROFILE_END_POINT : POSTS_END_POINT;
        const params = postingsType === "group" ? (`${method[postingsType]}/${groupid}/${userid}/${pageSize}/${pageNo * pageSize - pageSize}`) : (`${method[postingsType]}/${userid}/${pageSize}/${pageNo * pageSize - pageSize}`)
        return apiClient.get(endPoint + params);
    }
}
const savePost = (post, isEdit) => {
    return apiClient.post(POSTS_END_POINT + (isEdit ? "updatePosts" : "savePosts"), post)
}
const saveActions = (post_id, object) => {
    return apiClient.post(POSTS_END_POINT + `saveActions/${post_id}`, object);
}
const deleteActions = (post_id, user_id, type) => {
    return apiClient.get(POSTS_END_POINT + `deleteActions/${post_id}/${user_id}/${type}`);
}
const postComment = (post_id, object) => {
    return apiClient.post(POSTS_END_POINT + `saveComment/${post_id}`, object);
}
const deletePost = (post_id, user_id) => {
    return apiClient.get(POSTS_END_POINT + `deletePosts/${post_id}/${user_id}`);
}
const fetchComments = (post_id, take, skip) => {
    return apiClient.get(POSTS_END_POINT + `getPostComments/${post_id}/${take || 10}/${skip}`)
}
const fetchPostReactions = (post_id) => {
    return apiClient.get(POSTS_END_POINT + "getPostsLikes/" + post_id);
}
const saveUserPosts = (obj) => {
    return apiClient.post(PROFILE_END_POINT + "savedPosts", obj);
}
const fetchUserSavedPosts = (user_id, take, skip) => {
    return apiClient.get(PROFILE_END_POINT + `getUserSavedPosts/${user_id}/100/0`)
}
const deleteUserSavedPost = (post_id) => {
    return apiClient.get(PROFILE_END_POINT + "deleteSavedPost/" + post_id);
}
const getPostDetails = (post_id, user_id) => {
    return apiClient.get(PROFILE_END_POINT + `getPostDetails/${post_id}/${user_id}`);
}
export { getPosts, savePost, saveActions, deleteActions, postComment, deletePost, fetchComments, fetchPostReactions, saveUserPosts, fetchUserSavedPosts, deleteUserSavedPost, getPostDetails };