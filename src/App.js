import React, { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Router from './components/route.component';
import { loadUser, OidcProvider } from 'redux-oidc';
import { persistor, store } from './store';
import { userManager } from './shared/authentication/auth';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import LayoutComponent from './common/layout';

loadUser(store, userManager);
function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <OidcProvider userManager={userManager} store={store}>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <LayoutComponent />
            </Suspense>
          </BrowserRouter>
        </OidcProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
