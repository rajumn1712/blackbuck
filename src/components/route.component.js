import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from '../shared/authentication/protected_route';
import CommingSoon from './comingsoon';
import About from '../about-us';
import Contact from '../contact-us';
import Home from '../home';
import Post from '../common/post';
import Callback from "../shared/authentication/callback";
import Profile from '../profile';
import Group from '../group'
import ProfileView from '../profileview'
const Router = () => {
    return (
        <Switch>
            <ProtectedRoute path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/callback" component={Callback} />
            <ProtectedRoute path="/profile" component={Profile} />
            <ProtectedRoute path="/profileview/:userId" component={ProfileView} />
            <Route path="/group" component={Group} />
            <Route path="/commingsoon" component={CommingSoon} />
            <ProtectedRoute path="/post/:name" component={Post} />
            <ProtectedRoute path="" component={Home} />
        </Switch>
    )
}
export default Router