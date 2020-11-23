import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from '../shared/authentication/protected_route';
const About = lazy(() => import("../about-us"));
const Contact = lazy(() => import("../contact-us"));
const Home = lazy(() => import("../home"));
const Callback = lazy(() => import("../shared/authentication/callback"));
const Post = lazy(() => import("../common/post"));
const Profile = lazy(()=>import("../profile"));
const Group = lazy(()=>import("../group"));
const Router = () => {
    return (
        <Switch>
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/callback" component={Callback} />
            <Route path="/profile" component={Profile} />
            <Route path="/group" component={Group} />
            <ProtectedRoute path="/post/:name" component={Post} />
            <ProtectedRoute path="" component={Home} />
        </Switch>
    )
}
export default Router