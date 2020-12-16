import React, { Component, useState } from 'react';
import { Collapse, Menu, Row, Col, Input, Checkbox, Button, Card, Divider, Tooltip, List, Form, Modal } from 'antd';
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
        title: 'Ad account contact',
        description: 'saranyamallampati1201@gmail.com'
    },
    {
        title: 'Memorialization Settings',
        description: 'Decide what happens to your account after you pass away.'
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
                            <Card title="Settings" className="settings-left" >
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
                                        <Link to="/profile/1">
                                            <span className="icons settings-icon"></span>
                                            <span>Security and Login</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="profile ">
                                        <Link to="/profile/1">
                                            <span className="icons settings-icon"></span>
                                            <span>Public Posts</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="profile">
                                        <Link to="/profile/1">
                                            <span className="icons settings-icon"></span>
                                            <span>Blocking</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="profile ">
                                        <Link to="/profile/1">
                                            <span className="icons settings-icon"></span>
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
                            <Card title="General Account Settings" className="settings-card" >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={item => (
                                        <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit">Edit</a>]}>
                                            <List.Item.Meta
                                                title={<h3>{item.title}</h3>}
                                                description={<div>{item.description}</div>}
                                            />
                                        </List.Item>
                                    )}
                                />

                            </Card>
                            <Modal
                                visible={visible}
                                title="Name"
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={[
                                    <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>Save</Button>,
                                ]}
                            >
                                <div>
                                    <Form layout="vertical">
                                        <Row gutter={16}>

                                            <Col xs={24} sm={24}>
                                                <Form.Item
                                                    label="Firstname"
                                                    name="username"
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Lastname"
                                                    name="username"
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                                                    <Checkbox>Remember me</Checkbox>
                                                </Form.Item>
                                                <div className="p-12"><span className="fw-400">Please note:</span> If you change your name on Facebook, you can't change it again for 60 days. Don't add any unusual capitalization, punctuation, characters or random words. <a>Learn more.</a></div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </Modal>
                        </Col>
                    </Row>
                </div>




            </div>


        )
    }
}

export default Settings;