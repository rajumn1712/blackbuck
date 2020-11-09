import {apiClient} from './clients';

const POSTS_END_POINT = "posts/";
const getPosts = ()=>{

    return apiClient.get(POSTS_END_POINT+"posts");
}
export {getPosts};