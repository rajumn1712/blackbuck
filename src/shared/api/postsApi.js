import { apiClient } from './clients';

const POSTS_END_POINT = "service/api/posts/";
const getPosts = (userid, pageNo, pageSize, postingsType) => {
    const method = {
        "all": "getAllPosts",
        "user": "getUsersPosts"
    }
    return apiClient.get(POSTS_END_POINT + `${method[postingsType]}/${userid || "1"}/${pageSize}/${pageNo * pageSize - pageSize}`);
}
const savePost = (post) => {
    return apiClient.post(POSTS_END_POINT + "savePosts", post)
}
export { getPosts, savePost };