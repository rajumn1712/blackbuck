import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Input, Avatar, Badge, Dropdown, message, Drawer, List, Card } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import Logo from '../styles/images/logo.svg';
import avatar from '../styles/images/avatar.png';
import './header.css';
import ReactDOM from 'react-dom';

const { Meta } = Card;

const { Search } = Input;
const { Header } = Layout;
const onSearch = value => console.log(value);

const menu = (
    <Menu className="profile-dropdown">
        <Menu.Item key="0">
            <Meta
                avatar={<Avatar src={avatar} />}
                title="John Doe"
                description="See your profile"
            />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
            <Link to="/about">Switch Accounts
            </Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link to="/contact">Settings & Privacy
            </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link to="/posts">Help & Support
            </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4">
            <Link to="/posts"></Link>Sign Out
        </Menu.Item>



    </Menu >
);

class HeaderComponent extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <Header className="main-header">
                <Row>
                    <Col span={8} justify="start"  >
                        <div >
                            <Link to="/" className="logo-brand">
                                <img src={Logo} alt="Blackbuck" width="60px" />
                            </Link>
                            <Search className="header-searchbar" placeholder="Search" onSearch={onSearch} />
                        </div>
                    </Col>
                    <Col span={8} justify="center">
                        <Menu className="menu-items text-center" mode="horizontal" defaultSelectedKeys={['home']} title="Blackbuck">
                            <Menu.Item key="home"><Link to="/"><span className="icons home-icon"></span></Link></Menu.Item>
                            <Menu.Item key="about"><Link to="/about"><span className="icons social-icon"></span></Link></Menu.Item>
                            <Menu.Item key="contact"><Link to="/contact"><i className="icons suitcase-icon"></i></Link></Menu.Item>
                            <Menu.Item key="posts"><Link to="/"><i className="icons lms-icon"></i></Link></Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={8} >
                        <Menu className="menu-items text-right right-menu" mode="horizontal" title="Blackbuck">
                            <Menu.Item key="">
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Link to="/" onClick={e => e.preventDefault()}><i className="icons chat-icon"></i></Link>
                                </Dropdown>
                            </Menu.Item>
                            <Menu.Item key="">
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Link to="/about">
                                        <Badge className="notification-count" count={5} showZero>
                                            <i className="icons notification-icon">
                                            </i>
                                        </Badge>
                                    </Link>
                                </Dropdown>
                            </Menu.Item>
                            <Menu.Item key="" >
                                <Dropdown overlay={menu} trigger={['click']} >
                                    <Link to="/about" onClick={e => e.preventDefault()} className="avatar-menu" overlay={menu}>
                                        <img src={avatar} />
                                    </Link>
                                </Dropdown>
                            </Menu.Item>
                            {/* {user && <Menu.Item key="logout"> <Button onClick={() => { store.dispatch(userLogout()); userManager.signoutRedirect() }}>Logout</Button></Menu.Item>} */}
                        </Menu>
                    </Col>
                </Row>
            </Header>
        )
    }
}

export default HeaderComponent;