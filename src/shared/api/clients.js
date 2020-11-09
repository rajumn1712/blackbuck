import { create } from 'apisauce';

let apiClient = create({
    baseURL: "http://localhost:8529/_db/Blackbuck/"
});

export { apiClient }