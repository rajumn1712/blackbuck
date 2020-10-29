import { WebStorageStateStore } from 'oidc-client';
import { createUserManager } from 'redux-oidc'
const config = {
    authority: process.env.REACT_APP_AUTHORITY,
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    response_type: "id_token token",
    scope: "openid profile email custom.profile",
    silent_redirect_uri: 'https://smartcursors.org/admin.tst/silent_redirect.html',
    userStore: new WebStorageStateStore({ store: window.localStorage })
}
const userManager = createUserManager(config);

export { userManager }