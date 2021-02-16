import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles/fonts/stylesheet.css';
import './index.css';
import './styles/theme.css';
import './styles/skelton.css';
import { loadUser, OidcProvider } from 'redux-oidc';
import { store } from './store';
import { userManager } from './shared/authentication/auth';
import { Provider } from 'react-redux';
import LayoutComponent from './common/layout';
import Loader from './common/loader';
import firebase from './utils/firebase'
import { setUnRead } from './utils/chat-system/chatReducer';
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
    pushMessages.onMessage(payload => {
      store.dispatch(setUnRead(payload?.data?.user_id));
    });
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
