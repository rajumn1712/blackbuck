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
const saveActions = (post_id, type, object) => {
    return apiClient.post(POSTS_END_POINT + `saveActions/${post_id}/${type}`, object);
}
const deleteActions = (post_id, user_id, type) => {
    return apiClient.get(POSTS_END_POINT + `deleteActions/${post_id}/${user_id}/${type}`);
}
export { getPosts, savePost, saveActions, deleteActions };