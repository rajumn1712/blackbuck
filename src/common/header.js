import React, { Component } from 'react';
import { Layout, Menu, Row, Col, Input, Avatar, Badge, Dropdown, Drawer, Card, Divider, Tooltip } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import Logo from '../styles/images/logo.svg';
import avatar from '../styles/images/avatar.png';
import avatar2 from '../styles/images/user.jpg';
import userImage from '../styles/images/user_image.jpg';
import user_Image from '../styles/images/user-image.jpg';
import defaultUser from '../styles/images/defaultuser.jpg';
import sherlyn from '../styles/images/sherlyn.jpg';
import './header.css';
import '../index.css';
import { connect } from 'react-redux';
import { fetchUserFriends } from '../shared/api/apiServer';
import ChatSystem from '../utils/chat-system';
const { Meta } = Card;
const { Search } = Input;
const { Header } = Layout;
const onSearch = value => console.log(value);
const logout = () => {
    userLogout();
    userManager.signoutRedirect()
}
const notifications = (
    <div className="notification-dropdown">
        <div className="noti-dropdown-header">
            <h3>Notifications</h3>
            <Link to="/notifications" >View all</Link>
        </div>
        <Divider className="my-0" />
        <div className="notification-list unread">
            <div className="notification-image">
                <Avatar src={avatar} />
            </div>
            <div className="notification-description ">
                <p>Vin Diesel commented on your post.</p>
                <span>3 minutes ago</span>
            </div>
        </div>
        <div className="notification-list read">
            <div className="notification-image">
                <Avatar src={sherlyn} />
            </div>
            <div className="notification-description ">
                <p>Shrelyn mentioned you in the timeline.</p>
                <span>18 hours ago</span>
            </div>
        </div>
        <div className="notification-list read">
            <div className="notification-image">
                <Avatar src={avatar2} />
            </div>
            <div className="notification-description ">
                <p>Andrew sent you a friend request.</p>
                <span>1 day ago</span>
            </div>
        </div>
        <div className="notification-list  read">
            <div className="notification-image">
                <Avatar src={user_Image} />
            </div>
            <div className="notification-description">
                <p>Simon added a new photo.</p>
                <span>2 days ago</span>
            </div>
        </div>
        <div className="notification-list read">
            <div className="notification-image">
                <Avatar src={userImage} />
            </div>
            <div className="notification-description">
                <p>Vin Diesel shared his story.</p>
                <span>3 days ago</span>
            </div>
        </div>
    </div>
);



class HeaderComponent extends React.Component {

    state = {
        visible: false, placement: 'left', FirstName: "",
        Email: "",
        ProfilePic: "",
        friends: [],
        showMessenger: false,
        agentProfile: {
            imageUrl: null,
            teamName: null
        }
    };

    showDrawer = async () => {
        const friendsRes = await fetchUserFriends(this.props.profile?.Id)
        this.setState({
            visible: true,
            friends: friendsRes.data
        });
    };
    componentDidMount() {
        const storeState = store.getState();
        const { FirstName, LastName, Email, ProfilePic } = storeState.oidc?.profile || {};
        this.setState({ FirstName, LastName, Email, ProfilePic });
        store.subscribe(async () => {
            const state = store.getState();
            if (state.oidc?.profile) {
                const { FirstName, LastName, Email, ProfilePic } = state.oidc.profile;
                this.setState({ FirstName, LastName, Email, ProfilePic })
            }
        })

    }
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    menu = () => {
        return (<Menu className="profile-dropdown custom-dropdown">
            <Menu.Item key="0">
                <Link to="/profile">
                    <Meta
                        className="account-holder profilename"
                        avatar={<Avatar src={this.state?.ProfilePic || defaultUser} />}
                        title={this.state?.FirstName}
                        description={this.state?.Email}
                    />
                </Link>
            </Menu.Item>
            <Menu.Divider />
            {/* <Menu.Item key="1">
                <Link to="/commingsoon"><span className="icons swap-icon" /><span className="pl-16">Switch Accounts</span>
                </Link>
            </Menu.Item> */}
            <Menu.Item key="2">
                <Link to="/settings"><span className="icons settings-icon" /><span className="pl-16">Settings & Privacy</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link to="/support"><span className="icons globe-icon" /><span className="pl-16">Help & Support</span>
                </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="4">
                <a onClick={logout}><span className="icons signout-icon" /><span className="pl-16">Sign Out</span></a>
            </Menu.Item>
        </Menu >)
    }
    showChatWindow = (user) => {
        debugger
        this.setState({ ...this.state, showMessenger: true, agentProfile: { imageUrl: user.Image, teamName: user.Firstname } })
    }
    render() {
        const { visible } = this.state;
        return (
            <Header className="main-header">
                <Row className="desktop-navigation">
                    <Col span={8} justify="start"  >
                        <div className="left-block">
                            <Link to="/" className="logo-brand">
                                <img src={Logo} alt="Blackbuck" width="55px" />
                            </Link>
                            {this.props?.profile?.IsOnBoardProcess && <Search className="header-searchbar" placeholder="Search" onSearch={onSearch} />}
                        </div>
                    </Col>
                    <Col span={8} justify="center">
                        {this.props?.profile?.IsOnBoardProcess && <Menu className="menu-items text-center" mode="horizontal" defaultSelectedKeys={['home']}>
                            <Menu.Item key="home">
                                <Tooltip title="Home" placement="bottom">
                                    <Link to="/"><span className="icons home-icon"></span></Link>
                                </Tooltip>
                            </Menu.Item>
                            <Menu.Item key="about">
                                <Tooltip title="Connections" placement="bottom">
                                    <Link to="/friends"><span className="icons social-icon"></span></Link>
                                </Tooltip>
                            </Menu.Item>
                            <Menu.Item key="contact">
                                <Tooltip title="Careers" placement="bottom">
                                    <Link to="/cms"><span className="icons suitcase-icon" /></Link>
                                </Tooltip>
                            </Menu.Item>
                            <Menu.Item key="lms">
                                <Tooltip title="LMS" placement="bottom">
                                    <Link to="/lms"><span className="icons lms-icon" /></Link>
                                </Tooltip>
                            </Menu.Item>
                        </Menu>}
                    </Col>
                    <Col span={8} >
                        <Menu className="menu-items text-right right-menu" mode="horizontal">
                            {this.props?.profile?.IsOnBoardProcess && <Menu.Item key="">
                                <Tooltip title="Messages">
                                    <Link onClick={this.showDrawer}><i className="icons chat-icon"></i></Link>
                                </Tooltip>
                            </Menu.Item>}
                            {this.props?.profile?.IsOnBoardProcess && <Menu.Item key="">
                                <Dropdown overlay={notifications} trigger={['click']} placement="bottomCenter">
                                    <Tooltip title="Notifications">
                                        <Link to="/about">
                                            <Badge className="notification-count" count={5} showZero>
                                                <span className="icons notification-icon" />
                                            </Badge>
                                        </Link>
                                    </Tooltip>
                                </Dropdown>
                            </Menu.Item>}
                            <Menu.Item key="" >
                                <Dropdown overlay={this.menu} trigger={['click']} >
                                    <Link to="/" onClick={e => e.preventDefault()} className="avatar-menu" overlay={this.menu}>
                                        <img src={this.props?.profile?.ProfilePic || defaultUser} />
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
                            <Menu.Item key="" >
                                <Dropdown overlay={this.menu} trigger={['click']} >
                                    <Link to="/about" onClick={e => e.preventDefault()} className="avatar-menu" overlay={this.menu}>
                                        <img src={this.state.ProfilePic || defaultUser} />
                                    </Link>
                                </Dropdown>
                            </Menu.Item>
                        </Menu>
                    </Col>

                </Row>
                {/* Mobile Naviagtion */}
                <div className="">
                    <Drawer title="Messenger" placement="right" closable={false} onClose={this.onClose} visible={visible} width="360px" className="messenger-chat" closable="true" footer={<Link to="#" className="messenger-footer">See all in Messenger</Link>}>
                        <Search className="header-searchbar mb-16" placeholder="Search" onSearch={onSearch} />
                        <div className="messenger-drawer">
                            {this.state.friends?.map((friend, indx) => <Link key={indx} onClick={() => this.showChatWindow(friend)}>
                                <Meta
                                    avatar={<Avatar src={friend.Image} />}
                                    title={friend.Firstname}
                                    description={<p className="chat-description">{friend.Email}</p>}
                                />
                            </Link>)}
                            {/* <ChatSystem agentProfile={this.state.agentProfile} isOpen={this.state.showMessenger} handleClick={() => { this.setState({ ...this.state, isOpen: false }) }} /> */}
                        </div>
                    </Drawer>
                </div>
            </Header>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    const { user, profile } = oidc;
    return { profile, user }
}
export default connect(mapStateToProps)(HeaderComponent);