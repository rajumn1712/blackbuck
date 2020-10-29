import React from 'react';
import { Route } from 'react-router-dom';
import { store } from '../../store';
import { userManager } from './auth';
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const state = store.getState();
    debugger
    const { user } = state?.oidc;
    return (
        <Route {...rest} render={
            (props) => !user || user.expired ? userManager.signinRedirect() : <Component {...rest} {...props} />
        } />
    )
}

export default ProtectedRoute;

