import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Row, Col, Menu, Card, Avatar } from 'antd';
import Groups from './groups';
import AdminCourses from './courses';
import CourseComponent from './courses/CourseComponent';
// import Jobs from './jobs';
import Members from './members';
import TestSubmissions from './testsubmissions';
import AccessDenied from '../components/accessdenined';
import { connect } from 'react-redux';
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
                            <Menu.Item key="1">Job Applications</Menu.Item>
                            <Menu.Item key="2">Jobs</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div style={{ flex: 1, marginLeft: 260 }} className="p-12">
                    <Route path="/admin/courses" component={(this.props?.profile?.Category == "LMS" || this.props?.profile?.Category == "Root") ? AdminCourses : AccessDenied} />
                    <Route path="/admin/members" component={(this.props?.profile?.Category == "Root") ? Members : AccessDenied} />
                    <Route path="/admin/groups" component={(this.props?.profile?.Category == "Root") ? Groups : AccessDenied} />
                    <Route path="/admin/testsubmissions" component={(this.props?.profile?.Category == "LMS" || this.props?.profile?.Category == "Root") ? TestSubmissions : AccessDenied} />
                    <Route path="/admin/course/:id" component={(this.props?.profile?.Category == "LMS" || this.props?.profile?.Category == "Root") ? CourseComponent : AccessDenied} />
                </div>
            </div>
        </>
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile };
};
export default connect(mapStateToProps)(Admin);