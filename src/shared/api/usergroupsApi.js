import { apiClient } from './clients';

const POSTS_END_POINT = "posts/api/groups/";
const getGroups = (userid, pageNo, pageSize) => {
    return apiClient.get(POSTS_END_POINT + `getUserGroups/${userid || "1"}/${pageSize}/${pageNo * pageSize - pageSize}`);
}
export { getGroups };