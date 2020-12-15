import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles/fonts/stylesheet.css';
import  './index.css';
import './styles/theme.css';
import { loadUser, OidcProvider } from 'redux-oidc';
import { persistor, store } from './store';
import { userManager } from './shared/authentication/auth';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import LayoutComponent from './common/layout';
import { Space, Spin } from 'antd';
import Loader from './common/loader';
function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
    loadUser(store, userManager).then((user) => {   
        setLoading(false);
    });
  }, []);
  return (
    <Provider store={store}>
      <OidcProvider userManager={userManager} store={store}>
      
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Suspense fallback={<div>Loading...</div>}>
            {loading ? <Loader className="loader-top-middle"/> : <LayoutComponent />}
          </Suspense>
        </BrowserRouter>
      </OidcProvider>
    </Provider>
  );
}

export default App;
