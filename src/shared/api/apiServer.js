const { apiClient } = require("./clients");
const FRIENDS_API = "service/api/home/"
const getFriendSuggestions = (userid,page,pageSize)=>{
    return apiClient.get(FRIENDS_API+`friendsSuggestions/${userid||"1"}/${pageSize||10}/${page*pageSize-pageSize}`)
}

export {getFriendSuggestions}