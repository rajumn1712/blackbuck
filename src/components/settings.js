import React, { Component, useState } from 'react';
import { Collapse, Menu, Row, Col, Input, Checkbox, Button, Card, List, Form, Modal, Typography,Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { store } from '../store'
import '../index.css';
import '../App.css';
import { connect } from 'react-redux';
import Search from 'antd/lib/input/Search';
import { CaretRightOutlined } from '@ant-design/icons';
import AccSettings from '../styles/images/acc-settings.svg';
import Password from '../styles/images/password.svg';
import Privacy from '../styles/images/privacy.svg';
import Item from 'antd/lib/list/Item';
import { ErrorMessage, Field, Formik } from "formik";
const { Title } = Typography;
const data = [
    {
        title: 'Name',
        description: 'saranya'
    },
    {
        title: 'Username',
        description: ' https://www.blackbuck.com/saranya'
    },
    {
        title: 'Contact',
        description: 'saranyamallampati1201@gmail.com'
    },
    {
        title: 'Email id',
        description: 'saranyamallampati1201@gmail.com'
    },
    {
        title: 'Mobile No',
        description: '8834567896'
    },
];
const tailLayout = {
    wrapperCol: { span: 16 },
};
class Settings extends React.Component {
    state = {
        loading: false,
        visible: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };
    render() {
        const { visible, loading } = this.state;
        return (
            <div>
                <div className="main">
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={5}>
                            <Card title="Settings" className="settings-left left-rail" >
                                <Menu
                                    className="menu-items profile-menu"
                                    mode="vertical"
                                    title="Blackbuck"
                                >
                                    <Menu.Item key="profile">
                                        <Link to="/profile/1">
                                            <span className="icons settings-icon "></span>
                                            <span>General</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="profile">
                                        <Link to="/friends">
                                            <span className="icons securitylogin-icon"></span>
                                            <span>Security and Login</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="profile ">
                                        <Link to="/profile/1">
                                            <span className="icons publicposts-icon"></span>
                                            <span>Public Posts</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="profile">
                                        <Link to="/profile/1">
                                            <span className="icons blocking-icon"></span>
                                            <span>Blocking</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="profile ">
                                        <Link to="/profile/1">
                                            <span className="icons location-icon"></span>
                                            <span>Location</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="profile">
                                        <Link to="/profile/1">
                                            <span className="icons settings-icon"></span>
                                            <span>Notifications</span>
                                        </Link>
                                    </Menu.Item>

                                </Menu>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={16} lg={18} xl={18} xxl={18}>
                            <Card title="General Account Settings" className="settings-card mb-12">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={item => (
                                        <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit">Edit</a>]}>
                                            <List.Item.Meta
                                                title={<h3>{item.title}</h3>}
                                                description={<div><div>{item.description}</div>
                                                    {/* <span className="d-flex pb-12">
                                                        <Input placeholder={item.description} />
                                                        <Button className="mx-8" htmlType="submit" >Cancel</Button>
                                                        <Button type="primary" htmlType="close">Save</Button>
                                                        </span>   */}
                                                </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                            <div><Title level={5}>Security and Login</Title></div>
                            <Card title="Recommended" className="" >
                                <List
                                    itemLayout="horizontal"
                                    dataSource=""
                                    renderItem={item => (
                                        <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit">Edit</a>]}>
                                            <List.Item.Meta
                                             avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                title="Get alerts about unrecognized logins"
                                                description="Improve the security of your account by getting alerts when someone tries logging in to your account from an unknown device or browser."
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>


                        </Col>
                    </Row>
                </div>




            </div>


        )
    }
}

export default Settings;