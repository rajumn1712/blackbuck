import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Onboard from '../../components/onboard';
import Admin from '../../../src/admin';
import AccessDenied from '../../components/accessdenined';
import { store } from '../../store';
import connectStateProps from '../stateConnect';
import { userManager } from './auth';
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const state = store.getState();
    const { user } = state?.oidc;
    window.scrollTo(0, 0)
    useEffect(() => {

        if (!user || user.expired) {
            userManager.signinRedirect();
        }

    }, [])
    if (!rest.profile?.IsOnBoardProcess && user) {
        return <Route {...rest} render={
            (props) => <Onboard {...rest} {...props} />
        } />
    }
    if (!rest.profile?.Role && user && Component == Admin) {
        return <Route {...rest} render={
            (props) => <AccessDenied {...rest} {...props} />
        } />
    }
    return (
        <Route {...rest} render={
            (props) => <Component {...rest} {...props} />
        } />
    )
}

export default connectStateProps(ProtectedRoute);

