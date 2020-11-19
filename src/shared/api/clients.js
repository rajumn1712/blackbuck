import { create } from 'apisauce';

let apiClient = create({
    baseURL: process.env.REACT_APP_API_END_POINT
});

export { apiClient }