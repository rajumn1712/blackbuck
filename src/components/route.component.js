import React, { lazy } from "react";
import { Switch, Route } from "react-router-dom";
import ProtectedRoute from "../shared/authentication/protected_route";
import CommingSoon from "./comingsoon";
// import About from "../about-us";
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
      <Route path="/notifications" component={Notifications} />
      <Route path="/support" component={Help} />
      <Route path="/settings" component={Settings} />
      <ProtectedRoute path="/student_onboard" component={onBoard} />
      {/* <ProtectedRoute path="/friends" component={About} /> */}
      {/* <Route path="/contact" component={Contact} /> */}
      <Route path="/callback" component={Callback} />
      <ProtectedRoute path="/profile/:tabkey" component={Profile} />
      <ProtectedRoute path="/profileview/:userId" component={ProfileView} />
      <Route path="/group" component={Group} />
      <ProtectedRoute path="/groupview/:id" component={GroupView} />
      {/* <Route path="/creategroup" component={CreateGroup} /> */}
      <Route path="/commingsoon" component={CommingSoon} />
      <ProtectedRoute path="/newgroup/:id" component={CreateGroup} />
      <ProtectedRoute path="" component={Home} />
    </Switch>
  );
};
export default Router;
