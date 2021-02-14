import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles/fonts/stylesheet.css';
import './index.css';
import './styles/theme.css';
import { loadUser, OidcProvider } from 'redux-oidc';
import { store } from './store';
import { userManager } from './shared/authentication/auth';
import { Provider } from 'react-redux';
import LayoutComponent from './common/layout';
import Loader from './common/loader';
import firebase from './utils/firebase'
import { notification } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
    localStorage.setItem("__url", window.location.pathname);
    loadUser(store, userManager).then((user) => {
      setLoading(false);
    });
    const pushMessages = firebase.messaging();
    pushMessages.requestPermission().then(value => {
      return pushMessages.getToken();
    }).then(token => {
      const state = store.getState();
      if (token && state?.oidc?.profile?.Id) {
        firebase.firestore().collection("devices").doc(state?.oidc?.profile?.Id).collection("tokens").add({
          token
        });
      }
    }).catch(err => {
      console.log(err)
    })
    pushMessages.onMessage(payload => {
    
    })
  }, []);

  return (
    <Provider store={store}>
      <OidcProvider userManager={userManager} store={store}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Suspense fallback={<div>Loading...</div>}>
            {loading ? <Loader className="loader-top-middle" /> : <LayoutComponent />}
          </Suspense>
        </BrowserRouter>
      </OidcProvider>
    </Provider>
  );
}

export default App;
