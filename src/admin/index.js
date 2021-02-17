import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { Menu, Card } from 'antd';
import Groups from './groups';
import AdminCourses from './courses';
import CourseComponent from './courses/CourseComponent';
// import Jobs from './jobs';
import Members from './members';
import TestSubmissions from './testsubmissions';
import AccessDenied from '../components/accessdenined';
import { connect } from 'react-redux';
import '../../src/profile/profilestyle.css';
import JobPostings from './careers/jobpostings';
import JobApplications from './careers/jobapplications';
import PostingJob from './careers/jobpost';
import '../App.css';

const { Meta } = Card;
const { SubMenu } = Menu;

class Admin extends Component {

    render() {
        return <>
            <div className="d-flex">
                <div className="bg-white admin-left-pane">
                    <Menu mode="vertical" theme="light">
                        <SubMenu key="sub1" icon={<span className="left-menu social-networking mr-12" />} title="Social Networking" className={(this.props.location.pathname == '/admin/members' || this.props.location.pathname == '/admin/groups') ? "ant-menu-submenu-selected  ant-menu-submenu-active" : ""}>
                            <Menu.Item key="members" className={this.props.location.pathname == '/admin/members' ? 'ant-menu-item-selected' : ""}>
                                <Link to="/admin/members">Members</Link>
                            </Menu.Item>
                            <Menu.Item key="groups" className={this.props.location.pathname == '/admin/groups' ? 'ant-menu-item-selected' : ""}>
                                <Link to="/admin/groups">Groups</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<span className="left-menu lmsicon mr-12" />} title="LMS" className={(this.props.location.pathname == '/admin/courses' || this.props.location.pathname == '/admin/testsubmissions') ? "ant-menu-submenu-selected ant-menu-submenu-active" : ""}>
                            <Menu.Item key="courses" className={this.props.location.pathname == '/admin/courses' ? 'ant-menu-item-selected' : ""}>
                                <Link to="/admin/courses">Courses</Link>
                            </Menu.Item>
                            <Menu.Item key="assingments" className={this.props.location.pathname == '/admin/testsubmissions' ? 'ant-menu-item-selected' : ""}>
                                <Link to="/admin/testsubmissions">Test Submissions</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" icon={<span className="left-menu Careers mr-12" />} title="Careers">
                            <Menu.Item key="1"><Link to="/admin/jobapplications">Job Applications</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/admin/jobpostings">Jobs</Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="p-12 admin-right-panel">
                    <Route path="/admin/courses" component={(this.props?.profile?.Category == "LMS" || this.props?.profile?.Category == "Root") ? AdminCourses : AccessDenied} />
                    <Route path="/admin/members" component={(this.props?.profile?.Category == "Root") ? Members : AccessDenied} />
                    <Route path="/admin/groups" component={(this.props?.profile?.Category == "Root") ? Groups : AccessDenied} />
                    <Route path="/admin/testsubmissions" component={(this.props?.profile?.Category == "LMS" || this.props?.profile?.Category == "Root") ? TestSubmissions : AccessDenied} />
                    <Route path="/admin/course/:id" component={(this.props?.profile?.Category == "LMS" || this.props?.profile?.Category == "Root") ? CourseComponent : AccessDenied} />
                    <Route path="/admin/jobapplications" component={(this.props?.profile?.Category == "Careers" || this.props?.profile?.Category == "Root") ? JobApplications : AccessDenied}/>
                    <Route path="/admin/jobpostings" component={(this.props?.profile?.Category == "Careers" || this.props?.profile?.Category == "Root") ? JobPostings : AccessDenied}/>
                    <Route path="/admin/postingjob/:id" component={(this.props?.profile?.Category == "Careers" || this.props?.profile?.Category == "Root") ? PostingJob : AccessDenied}/>
                </div>
            </div>
        </>
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile };
};
export default connect(mapStateToProps)(Admin);