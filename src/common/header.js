import React, { Component } from 'react';
import { Button, Layout, Menu, Row, Col, Input, Avatar, Badge, Dropdown, Drawer, List, Card } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import Logo from '../styles/images/logo.svg';
import avatar from '../styles/images/avatar.png';
import avatar2 from '../styles/images/user.jpg';
import './header.css';

const { Meta } = Card;
const { Search } = Input;
const { Header } = Layout;
const onSearch = value => console.log(value);

const data = [
    {
        title: 'Vin Diesel ',
        descriptions: 'Although social distancing has created many changes with CBU courses',
    },
    {
        title: 'Andrew',
        descriptions: 'we are still offering a wide range of classes virtually. You read correctly',
    },
    {
        title: 'Michel',
        descriptions: 'Do you miss seeing the friendly faces',
    },
    {
        title: 'simon',
        descriptions: 'your fellow Colony Brands’ employees?',
    },
];

const notifications = (
    <div className="notification-dropdown">
        <h2>Notifications</h2>
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={avatar2} />}
                        title={<a href="">{item.title}</a>}
                        description={item.descriptions}
                    />
                </List.Item>
            )}
        />
    </div>

);

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

class HeaderComponent extends React.Component {

    state = { visible: false, placement: 'left' };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { user } = store.getState().oidc;
        const { visible } = this.state;
        return (
            <Header className="main-header">
                <Row className="desktop-navigation">
                    <Col span={8} justify="start"  >
                        <div className="left-block">
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
                                <Link to="/" onClick={this.showDrawer}><i className="icons chat-icon"></i></Link>
                            </Menu.Item>
                            <Menu.Item key="">
                                <Dropdown overlay={notifications} trigger={['click']} placement="bottomCenter">
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

                {/* Mobile Naviagtion */}
                <Row className="mobile-navigation">
                    <Col xs={16} span={8} justify="start"  >
                        <div className="left-block">
                            <Link to="/" className="logo-brand">
                                <img src={Logo} alt="Blackbuck" width="60px" />
                            </Link>
                            <Search className="header-searchbar" placeholder="Search" onSearch={onSearch} />
                        </div>
                    </Col>
                    <Col xs={8} span={8} >
                        <Menu className="menu-items text-right right-menu" mode="horizontal" title="Blackbuck">
                            {/* <Menu.Item key="">
                                <Link to="/" onClick={this.showDrawer}><i className="icons chat-icon"></i></Link>
                            </Menu.Item>
                            <Menu.Item key="">
                                <Dropdown overlay={notifications} trigger={['click']} placement="bottomCenter">
                                    <Link to="/about">
                                        <Badge className="notification-count" count={5} showZero>
                                            <i className="icons notification-icon">
                                            </i>
                                        </Badge>
                                    </Link>
                                </Dropdown>
                            </Menu.Item> */}
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
                    <Col xs={24} span={8} justify="center">
                        <Menu className="menu-items text-center" mode="horizontal" defaultSelectedKeys={['home']} title="Blackbuck">
                            <Menu.Item key="home"><Link to="/"><span className="icons home-icon"></span></Link></Menu.Item>
                            <Menu.Item key="about"><Link to="/about"><span className="icons social-icon"></span></Link></Menu.Item>
                            <Menu.Item key="contact"><Link to="/contact"><i className="icons suitcase-icon"></i></Link></Menu.Item>
                            <Menu.Item key="posts"><Link to="/"><i className="icons lms-icon"></i></Link></Menu.Item>
                        </Menu>
                    </Col>
                </Row>
                {/* Mobile Naviagtion */}
                <div className="messenger-chat">
                    <Drawer
                        title="Messenger"
                        placement="right"
                        closable={false}
                        onClose={this.onClose}
                        visible={visible}
                        width="300px"

                    >
                        <div className="messenger-drawer">
                            <Meta
                                avatar={<Avatar src={avatar} />}
                                title="John Doe"
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lacinia neque nec nisi condimentum ultricies. Pellentesque aliquam suscipit velit, in dignissim"
                            />
                        </div>

                    </Drawer>
                </div>
            </Header>
        )
    }
}

export default HeaderComponent;