import { create } from 'apisauce';

let apiClient = create({
    baseURL: process.env.REACT_APP_API_END_POINT
});
let cloudMessaging = create({
    baseURL: "https://fcm.googleapis.com/",
    headers: {
        "AUthorization": "key=" + "AAAAvqADiNk:APA91bHrDoeho4DUw9Isn8HU3gn5jH-ZcPbUUt6eLLS0T4EwH0LyZrvhj_VQMnCVScNpWV7_PC3aNTTYpgO1nmeGYVQguTZockEJ1yZPekZ8Ip7WE57O38fUP4mo-zURnw_n2o-YdtP6"
    }
})

export { apiClient,cloudMessaging }