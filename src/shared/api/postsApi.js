import {apiClient} from './clients';

const POSTS_END_POINT = "service/api/posts/";
const getPosts = ()=>{

    return apiClient.get(POSTS_END_POINT+"getAllPosts/1/5/o");
}
export {getPosts};