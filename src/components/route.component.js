import React, { lazy } from "react";
import { Switch, Route } from "react-router-dom";
import ProtectedRoute from "../shared/authentication/protected_route";
import CommingSoon from "./comingsoon";
import Friends from "../components/friends";
// import Contact from "../contact-us";
import Home from "../home";
import Callback from "../shared/authentication/callback";
import Profile from "../profile";
import Group from "../group";
import ProfileView from "../profile/profileView";
import GroupView from "../group/groupview";
import CreateGroup from "../group/creategroup";
// import CreateGroup from './creategroup';
import OnBoard from "../components/onboard";
import Help from '../components/help';
import { Col, Row } from "antd";
import Settings from "./settings";
import Notifications from "./notification";
import Connection from '../connections';
import SinglePostView from "./singlePostview";
import Admin from "../admin";
import LMSComponent from "../lms";
import CMSComponent from "../careers";
import CourseContent from "../lms/coursecontent";


const onBoard = () => {
  return (
    <div className="main">
      <Row gutter={16} justify="center">
        <Col xs={24} md={20}>
          <OnBoard />
        </Col>
      </Row>
    </div>
  );
};
const Router = () => {
  return (
    <Switch>
      <ProtectedRoute path="/lms" component={LMSComponent} />
      <ProtectedRoute path="/cms" component={CMSComponent} />
      <ProtectedRoute path="/coursecontent" component={CourseContent} />
      <ProtectedRoute path="/admin" component={Admin} />
      <ProtectedRoute path="/post/:id" component={SinglePostView} />
      <ProtectedRoute path="/notifications" component={Notifications} />
      <ProtectedRoute path="/support" component={Help} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/student_onboard" component={onBoard} />
      <ProtectedRoute path="/friends" component={Connection} />
      <Route path="/callback" component={Callback} />
      <ProtectedRoute path="/profile/:tabkey" component={Profile} />
      <ProtectedRoute path="/profileview/:userId" component={ProfileView} />
      <Route path="/group" component={Group} />
      <ProtectedRoute path="/groupview/:id" component={GroupView} />
      <Route path="/commingsoon" component={CommingSoon} />
      <ProtectedRoute path="/newgroup/:id" component={CreateGroup} />
      <ProtectedRoute path="" component={Home} />
    </Switch>
  );
};
export default Router;
