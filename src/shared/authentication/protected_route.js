import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { store } from '../../store';
import { userManager } from './auth';
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const state = store.getState();
    const { user } = state?.oidc;
    window.scrollTo(0,0)
    useEffect(() => {
        
        if (!user || user.expired) {
            userManager.signinRedirect();
        }
    }, [])
    return (
        <Route {...rest} render={
            (props) => <Component {...rest} {...props} />
        } />
    )
}

export default ProtectedRoute;

