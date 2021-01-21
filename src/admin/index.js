import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Row, Col, Menu, Card, Avatar } from 'antd';
import Groups from './groups';
import AdminCourses from './courses';
// import Jobs from './jobs';
import Members from './members';
import TestSubmissions from './testsubmissions';
import defaultUser from "../styles/images/defaultuser.jpg";
import coverphoto from "../styles/images/default-cover.png";
import '../../src/profile/profilestyle.css';

const { Meta } = Card;
const { SubMenu } = Menu;

class Admin extends Component {

    render() {
        return <>
            <div className="d-flex">
                <div className="bg-white admin-left-pane">
                    {/* <Menu
                        className="menu-items profile-menu"
                        mode="vertical"
                        title="Blackbuck"
                    >
                        <Menu.Item key="courses">
                            <Link to="/admin/courses">
                                <span className="left-menu profile-icon"></span>
                                <span>Courses</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="members">
                            <Link to="/admin/members">
                                <span className="left-menu profile-icon"></span>
                                <span>Members</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="groups">
                            <Link to="/admin/groups">
                                <span className="left-menu profile-icon"></span>
                                <span>Groups</span>
                            </Link>
                        </Menu.Item>
                    </Menu> */}
                    <Menu mode="vertical" theme="light">
                        <SubMenu key="sub1" icon={<span className="left-menu social-networking mr-12" />} title="Social Networking">
                            <Menu.Item key="members">
                                <Link to="/admin/members">Members</Link>
                            </Menu.Item>
                            <Menu.Item key="groups">
                                <Link to="/admin/groups">Groups</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<span className="left-menu lmsicon mr-12" />} title="LMS">
                        <Menu.Item key="courses">
                                <Link to="/admin/courses">Courses</Link>
                            </Menu.Item>
                            <Menu.Item key="assingments">
                                <Link to="/admin/testsubmissions">Test Submissions</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" icon={<span className="left-menu Careers mr-12" />} title="Careers">
                            <Menu.Item key="1">Members</Menu.Item>
                            <Menu.Item key="2">Jobs</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div style={{flex: 1, marginLeft: 260}} className="p-12">
                    <Route path="/admin/courses" component={AdminCourses} />
                    <Route path="/admin/members" component={Members} />
                    <Route path="/admin/groups" component={Groups} />
                    <Route path="/admin/testsubmissions" component={TestSubmissions} />
                    {/* <Route path="/admin/jobs" component={Jobs} /> */}
                </div>
            </div>
        </>
    }
}
export default Admin;