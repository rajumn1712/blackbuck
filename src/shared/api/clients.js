import { create } from 'apisauce';

let apiClient = create({
    baseURL: "https://jsonplaceholder.typicode.com/"
});

export { apiClient }