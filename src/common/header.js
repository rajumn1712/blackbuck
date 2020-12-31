import React, { Component } from 'react';
import { Layout, Menu, Row, Col, Input, Avatar, Badge, Dropdown, Drawer, Card, Divider, Tooltip,Button } from 'antd'
import { Link, withRouter } from 'react-router-dom';
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
import { fetchFriendRequests, fetchUserFriends } from '../shared/api/apiServer';
import ChatSystem from '../utils/chat-system';
const { Meta } = Card;
const { Search } = Input;
const { Header } = Layout;
const onSearch = value => console.log(value);
const logout = () => {
    userLogout();
    userManager.signoutRedirect()
}
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
        },
        notifications: null,
        notificationsCount: 0,
        search_value: this.props.search_value
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
        const { FirstName, LastName, Email, ProfilePic, Id } = storeState.oidc?.profile || {};
        this.handleNotifications(Id);
        this.setState({ FirstName, LastName, Email, ProfilePic });
        store.subscribe(async () => {
            const state = store.getState();
            if (state.oidc?.profile) {
                const { FirstName, LastName, Email, ProfilePic, Id } = state.oidc.profile;
                this.handleNotifications(Id);
                this.setState({ FirstName, LastName, Email, ProfilePic })
            }
        });


    }
    componentDidUpdate(prevProps) {
        if (prevProps.search_value != this.props.search_value) { this.setState({ ...this.state, search_value: this.props.search_value }); }
    }
    async handleNotifications(id) {
        if (id) {
            const friendRequests = await fetchFriendRequests(id);
            if (friendRequests.ok) {
                const notifications = <div className="notification-dropdown">
                    <div className="noti-dropdown-header p-12 text-left">
                        <h3>Notifications</h3>
                    </div>
                    <Divider className="my-0" />
                    <div className="notification-container">
                        {friendRequests.data?.map((friend, indx) => <div key={indx} className="notification-list read p-12">
                            <div className="notification-image">
                                <Avatar src={friend.Image || defaultUser} />
                            </div>
                            {/* <div className="notification-description text-left">
                                <p><b>{friend.Firstname} {friend.Lastname}</b> Sent you a friend request</p>
                                <span><Link to="/profile/IsProfileFriendsTab">Respond</Link></span>
                            </div> */}
                            <div className="notification-description text-left">
                                <p className="mb-4"><b>{friend.Firstname} {friend.Lastname}</b> Sent you a friend request</p>
                                <p className="textsecondary f-14 mb-8">2 weeksago</p>
                            <div>
                                <a className="f-14 mr-16 semibold text-primary">Accept</a>
                                <span className="f-14 semibold text-red">Remove</span>
                            </div>
                            </div>
                        </div>)}
                        {friendRequests.data.length === 0 && <p style={{ alignItems: "center", fontWeight: "bold" }}>You're all set</p>}
                    </div>
                    <Divider className="my-0" />
                    <div className="p-8 pt-4">
                    <a className="f-16 semibold text-primary p-8 d-block button-hover">View all</a>
                    </div>
                    
                </div>;
                this.setState({ ...this.state, notifications, notificationsCount: friendRequests.data?.length })

            }

        }
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
            <Menu.Item key="4" onClick={logout}>
                <a ><span className="icons signout-icon" /><span className="pl-16">Sign Out</span></a>
            </Menu.Item>
        </Menu >)
    }
    showChatWindow = (user) => {
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
                            {this.props?.profile?.IsOnBoardProcess && <Search onChange={(event) => {
                                const val = document.querySelector(".ant-input-search").querySelector(".ant-input").value;
                                this.setState({ ...this.state, search_value: val });
                            }} value={this.state.search_value} className="header-searchbar" placeholder="Search" onSearch={(value) => {
                                this.setState({ ...this.state, search_value: value });
                                this.props.history.push("/search/" + value + "/Search")
                            }} />}
                        </div>
                    </Col>
                    <Col span={8} justify="center">
                        {this.props?.profile?.IsOnBoardProcess && <Menu className="menu-items center-menu text-center" mode="horizontal" defaultSelectedKeys={['home']}>
                            <Menu.Item key="home" id="headerIcon">
                                <Tooltip title="Home" placement="bottom" getPopupContainer={() => document.querySelector('#headerIcon')}>
                                    <Link to="/" className="header-link"><span className="icons home-icon"></span></Link>
                                </Tooltip>
                            </Menu.Item>
                            {/* <Menu.Item key="about">
                                <Tooltip title="Connections" placement="bottom" getPopupContainer={() => document.querySelector('#headerIcon')}>
                                    <Link to="/friends" className="header-link"><span className="icons social-icon"></span></Link>
                                </Tooltip>
                            </Menu.Item> */}
                            <Menu.Item key="contact">
                                <Tooltip title="Careers" placement="bottom" getPopupContainer={() => document.querySelector('#headerIcon')}>
                                    <Link to="/cms" className="header-link"><span className="icons suitcase-icon" /></Link>
                                </Tooltip>
                            </Menu.Item>
                            <Menu.Item key="lms">
                                <Tooltip title="LMS" placement="bottom" getPopupContainer={() => document.querySelector('#headerIcon')}>
                                    <Link to="/lms" className="header-link"><span className="icons lms-icon" /></Link>
                                </Tooltip>
                            </Menu.Item>
                        </Menu>}
                    </Col>
                    <Col span={8} >
                        <Menu className="menu-items text-right right-menu" mode="horizontal">
                            {this.props?.profile?.IsOnBoardProcess && <Menu.Item key="">
                                <Tooltip title="Messages" placement="bottom" getPopupContainer={() => document.querySelector('#headerIcon')}>
                                    <Link className="header-link" onClick={this.showDrawer}><i className="icons chat-icon"></i></Link>
                                </Tooltip>
                            </Menu.Item>}
                            {this.props?.profile?.IsOnBoardProcess && <Menu.Item key="">
                            <Dropdown overlay={this.state.notifications} trigger={['click']} placement="bottomCenter" getPopupContainer={() => document.querySelector('#headerIcon')}>
                                    <Tooltip title="Notifications" getPopupContainer={() => document.querySelector('#headerIcon')}>
                                        <Link className="header-link">
                                            <Badge className="notification-count" count={this.state.notificationsCount} showZero>
                                                <span className="icons notification-icon" />
                                            </Badge>
                                        </Link>
                                    </Tooltip>
                                </Dropdown>
                            </Menu.Item>}
                            <Menu.Item key="">
                                <Dropdown overlay={this.menu} trigger={['click']} getPopupContainer={() => document.querySelector('#headerIcon')}>
                                    <Link className="header-link" to="/" onClick={e => e.preventDefault()} className="avatar-menu" overlay={this.menu}>
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
    const { user, profile, search_value } = oidc;
    return { profile, user, search_value }
}
export default withRouter(connect(mapStateToProps)(HeaderComponent));