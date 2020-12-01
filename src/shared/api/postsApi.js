import { apiClient } from './clients';

const POSTS_END_POINT = "service/api/posts/";
const getPosts = (userid, pageNo, pageSize, postingsType) => {
    const method = {
        "all": "getAllPosts",
        "user": "getUsersPosts"
    }
    return apiClient.get(POSTS_END_POINT + `${method[postingsType]}/${userid}/${pageSize}/${pageNo * pageSize - pageSize}`);
}
const savePost = (post) => {
    return apiClient.post(POSTS_END_POINT + "savePosts", post)
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
const deletePost = (post_id,user_id) => {
    return apiClient.get(POSTS_END_POINT + `deletePosts/${post_id}/${user_id}`);
}
const fetchComments = (post_id, take, skip) => {
    return apiClient.get(POSTS_END_POINT + `getPostComments/${post_id}/${take || 10}/${skip}`)
}
const fetchPostReactions = (post_id)=>{
    return apiClient.get(POSTS_END_POINT+"getPostsLikes/"+post_id);
}
export { getPosts, savePost, saveActions, deleteActions, postComment, deletePost,fetchComments,fetchPostReactions };