import React, { Component } from 'react';
import { Collapse, Menu, Row, Col, Input, Avatar, Badge, Dropdown, Drawer, Card, Divider, Tooltip, List, Form } from 'antd';
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

class Settings extends Component {

    render() {

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
                                        <List.Item actions={[<a key="list-loadmore-edit">Edit</a>]}>
                                            <List.Item.Meta 
                                                title={<a>{item.title}</a>}
                                                description={<a>{item.description}</a>}
                                            />
                                        </List.Item>
                                    )}
                                />

                            </Card>
                        </Col>
                    </Row>
                </div>
                {/* <Row justify="center">
                    <Col xs={24} md={16} className="mt-16">
                        <Card title="General Account Settings" bordered={true}  >
                        <Col xs={24} sm={12}>
                      <Form.Item label="Email" className="custom-fields">
                        <Input  name="Email" /> 
                      </Form.Item>
                      <Form.Item label="Email" className="custom-fields">
                        <Input  name="Email" /> 
                      </Form.Item>
                    </Col>
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        <Form.Item label="Email" className="custom-fields">
                                            <Input name="Email" />
                                        </Form.Item>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row> */}



            </div>


        )
    }
}

export default Settings;