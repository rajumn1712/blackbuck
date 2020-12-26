import React, { Component, useState } from 'react';
import { Collapse, Menu, Row, Col, Input, Checkbox, Button, Card, List, Form, Modal, Typography, Avatar, Divider, Select, Switch } from 'antd';
import { Link } from 'react-router-dom';
import { store } from '../store'
import '../index.css';
import '../App.css';
import { connect } from 'react-redux';
import Search from 'antd/lib/input/Search';
import { CaretRightOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import AccSettings from '../styles/images/acc-settings.svg';
import Password from '../styles/images/password.svg';
import Privacy from '../styles/images/privacy.svg';
import Item from 'antd/lib/list/Item';
import { ErrorMessage, Field, Formik } from "formik";
const { Title, Paragraph } = Typography;
const { Option } = Select;
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
                <div className="main custom-fields">
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={5}>
                            <Card title="Settings" className="settings-left left-rail" >
                                <Menu
                                    className="menu-items profile-menu"
                                    mode="vertical"
                                    title="Blackbuck"
                                >
                                    <Menu.Item key="profile">
                                        <Link to="/profile/IsProfileTab">
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
                                        <Link to="/profile/IsProfileTab">
                                            <span className="icons publicposts-icon"></span>
                                            <span>Public Posts</span>
                                        </Link>
                                    </Menu.Item>
                                    {/* <Menu.Item key="profile">
                                        <Link to="/profile/1">
                                            <span className="icons blocking-icon"></span>
                                            <span>Blocking</span>
                                        </Link>
                                    </Menu.Item> */}
                                    {/* <Menu.Item key="profile ">
                                        <Link to="/profile/1">
                                            <span className="icons location-icon"></span>
                                            <span>Location</span>
                                        </Link>
                                    </Menu.Item> */}
                                    <Menu.Item key="profile">
                                        <Link to="/profile/IsProfileTab">
                                            <span className="icons settings-icon"></span>
                                            <span>Notifications</span>
                                        </Link>
                                    </Menu.Item>

                                </Menu>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={16} lg={18} xl={18} xxl={18}>
                            <Card title="General Account Settings" className="settings-card set-flex mb-12">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={item => (
                                        <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit">Edit</a>]}>
                                            <List.Item.Meta
                                                title={<h3 className="mb-0">{item.title}</h3>}
                                                description={<div><div>{item.description}</div>
                                                    <span className="d-flex pb-12">
                                                        <Input placeholder={item.description} />
                                                        <Button className="mx-8" type="primary" htmlType="submit">Save</Button>
                                                            <Button htmlType="close" >Cancel</Button>
                                                    </span>
                                                </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                            <Card title="Security and Login" className="settings-card mb-12" >
                                <List
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
                                />
                            </Card>
                            {/* <Card title="Advanced" className="settings-card mb-12" >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={Advanced}
                                    renderItem={item => (
                                        <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit">Edit</a>]}>
                                            <List.Item.Meta
                                                title={<h3 className="mb-0">{item.title}</h3>}
                                                description={<div><div>{item.description}</div>
                                                      <span className="d-flex pb-12">
                                                        <Input />
                                                        <Button className="mx-8" htmlType="submit" >Cancel</Button>
                                                        <Button type="primary" htmlType="close">Save</Button>
                                                        </span>    
                                                </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card> */}
                            <Card title="Public Posts" className="settings-card set-width set-flex mb-12" >
                                <List
                                    itemLayout="horizontal"
                                    renderItem={item => (
                                        <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit ml-0">Edit</a>]}>
                                            <List.Item.Meta
                                                title={<h3 className="mb-0">Who Can Follow Me</h3>}
                                                description={<div><div>
                                                    Followers see your posts in News Feed. Friends follow your posts by default, but you can also allow people who are not your friends to follow your public posts. Use this setting to choose who can follow you.
                                                    Each time you post, you choose which audience you want to share with.
                                                    This setting doesn't apply to people who follow you on Marketplace and in buy and sell groups. You can manage those settings on Marketplace.</div>

                                                </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                                <List
                                    itemLayout="horizontal"
                                    dataSource={Posts}
                                    renderItem={item => (
                                        <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit">Edit</a>]}>
                                            <List.Item.Meta
                                                title={<h3 className="mb-0">{item.title}</h3>}
                                                description={<div><div>{item.description}</div>

                                                </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                            {/* <Card title="Location" className="settings-card set-flex mb-12" >
                                <List
                                    itemLayout="horizontal"
                                    renderItem={
                                        <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit">Edit</a>]}>
                                            <List.Item.Meta
                                                title={<h3 className="mb-0">Location History</h3>}
                                                description={<div><div>Turn on Location History for your mobile devices?</div>
                                                    <Select defaultValue="lucy" style={{ width: 80 }} onChange={handleChange}>
                                                        <Option value="jack">On</Option>
                                                        <Option value="lucy">Off</Option>
                                                    </Select>
                                                </div>
                                                }
                                            />
                                        </List.Item>
                                    }
                                />
                            </Card> */}
                            {/* <Card title="Notifications Settings" className="settings-card set-flex mb-12" >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data2}
                                    renderItem={
                                        <List.Item actions={[<a onClick={this.showModal} key="list-loadmore-edit">Edit</a>]}>
                                            <List.Item.Meta
                                                title={<h3 className="mb-0">Location History</h3>}
                                                description={<div><div>Turn on Location History for your mobile devices?</div>

                                                </div>
                                                }
                                            />
                                        </List.Item>
                                    }
                                />
                            </Card> */}
                            <Card title="Notifications" className="settings-card mb-12">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data2}
                                    renderItem={item => (
                                        <List.Item className="m-auto" actions={[<a onClick={this.showModal} key="list-loadmore-edit"><Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked /></a>]}>
                                            <List.Item.Meta
                                                title={<h3 className="mb-0">{item.title}</h3>}
                                                description={<div><div>{item.description}</div>
                                                </div>
                                                }
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