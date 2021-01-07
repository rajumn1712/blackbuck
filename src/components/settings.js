import React, { Component, useState } from 'react';
import { Collapse, Menu, Row, Col, Input, Checkbox, Button, Card, List, Form, Modal, Typography, Avatar, Divider, Select, Switch } from 'antd';
import { Link } from 'react-router-dom';
import { store } from '../store'
import '../index.css';
import '../App.css';
import ChangePassword from "../components/ProfileComponents/changepassword";
import { connect } from 'react-redux';
import Search from 'antd/lib/input/Search';
import { CaretRightOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import AccSettings from '../styles/images/acc-settings.svg';
import TwoFactor from '../styles/images/twofactor.png';
import Password from '../styles/images/password.svg';
import Privacy from '../styles/images/privacy.svg';
import Item from 'antd/lib/list/Item';
import { ErrorMessage, Field, Formik } from "formik";
const { Title, Paragraph } = Typography;
const { Option } = Select;
const data = [
    {
        title: 'Authentication Set Up',
    }

];
const data1 = [
    {
        title: 'Change password',

    },

];

const Posts = [
    {
        title: 'Public Post Comments',
        description: 'Recover access to other sites with your Facebook account'
    },
    {
        title: 'Public Post Notifications',
        description: 'See a list of emails we sent you recently, including emails about security'
    },

];
const data2 = [
    {
        title: 'Comments',
        description: 'Push, Email, SMS'
    },
    {
        title: 'Tags',
        description: 'Push, Email, SMS'
    },
    {
        title: 'Reminders',
        description: 'Push, Email, SMS'
    },
    {
        title: 'More Activity About You',
        description: 'Push, Email, SMS'
    },
    {
        title: 'Updates From Friends',
        description: 'Push, Email, SMS'
    },
    {
        title: 'Friend Requests',
        description: 'Push, Email, SMS'
    },
    {
        title: 'People You May Know',
        description: 'Push, Email, SMS'
    },
    {
        title: 'Birthdays',
        description: 'Push, Email, SMS'
    },
    {
        title: 'Groups',
        description: 'Push, Email, SMS'
    },
    {
        title: 'Video',
        description: 'Push, Email, SMS'
    },
    {
        title: 'Events',
        description: 'Push, Email, SMS'
    },
    {
        title: 'Pages You Follow',
        description: 'Push, Email, SMS'
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
        function handleChange(value) {
            console.log(`selected ${value}`);
        }
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
                                        <Link to="/friends">
                                            <span className="left-menu securitylogin-icon"></span>
                                            <span>Change Password</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="profile ">
                                        <Link to="/profile/IsProfileTab">
                                            <span className="left-menu blocking-icon"></span>
                                            <span>Twofactor Authentication</span>
                                        </Link>
                                    </Menu.Item>
                                </Menu>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={16} lg={18} xl={18} xxl={18}>
                            <Card title="Change password" className="settings-card mb-12" >
                                <Row gutter={12}>
                                    <Col xs={24} sm={24}>
                                        <ChangePassword />
                                    </Col>
                                </Row>
                                {/* <List
                                    itemLayout="horizontal"
                                    dataSource={data1}
                                    renderItem={item => (
                                        <List.Item >
                                            <List.Item.Meta
                                                title={<h3 className="mb-0">{item.title}</h3>}
                                                description={<div><div>{item.description}</div>
                                                    <Divider />
                                                    <div className=" pb-12">
                                                        <div className="d-flex my-8"><span className="change-text">Current</span>
                                                            <Input className="w-300" />
                                                        </div>
                                                        <div className="d-flex my-8"><span className="change-text">New </span>
                                                            <Input className="w-300" />
                                                        </div>
                                                        <div className="d-flex my-8"><span className="change-text">Re-enter new </span>
                                                            <Input className="w-300" />
                                                        </div>
                                                        <div className="text-center">
                                                            <Button className="mx-8" type="primary" htmlType="submit">Save</Button>
                                                            <Button htmlType="close" >Cancel</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                /> */}
                            </Card>
                            <Card title="Twofactor Authentication" className="settings-card mb-12" >
                                <Row gutter={12}>
                                    <Col xs={24} sm={24}>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={data}
                                            renderItem={item => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar className="wh-50" src={TwoFactor} />}
                                                        title={<a className="f-18 count-link" href="">{item.title}</a>}
                                                        description="This extra step shows it’s really you trying to sign in."
                                                    />
                                                   <div id="radioBtn" class="btn-group">
                                                        <Button size="small" className="radious-right notActive">Enable</Button>
                                                        <Button size="small" type="primary" className="radious-left active">Disable </Button>
                                                    </div>
                                                </List.Item>
                                            )}
                                            
                                        />
                                        

                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>




            </div>


        )
    }
}

export default Settings;