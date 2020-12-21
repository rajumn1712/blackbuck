import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Row, Col, Menu, Card, Avatar } from 'antd';
import Groups from './groups';
import AdminCourses from './courses';
import Members from './members';
import defaultUser from "../styles/images/defaultuser.jpg";
import coverphoto from "../styles/images/default-cover.png";
import '../../src/profile/profilestyle.css';

const { Meta } = Card;
class Admin extends Component {

    render() {
        return <div className="main">
            <Row gutter={16}>
                <Col xs={6} sm={12} md={8} lg={6} xl={5} xxl={5}>
                    <div className="left-rail">
                        <Card
                            className="profile-card"
                            cover={<img src={coverphoto} />}
                        >
                            <Meta
                                avatar={<Avatar src={defaultUser} />}
                                title={
                                    <div>
                                        Manojkumar
                                        </div>
                                }
                                description="Admin"
                            />
                        </Card>
                        <Menu
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
                        </Menu>
                    </div>
                </Col>
                <Col span={18}>
                    <Route path="/admin/courses" component={AdminCourses} />
                    <Route path="/admin/members" component={Members} />
                    <Route path="/admin/groups" component={Groups} />
                </Col>
            </Row>
        </div>
    }
}
export default Admin;