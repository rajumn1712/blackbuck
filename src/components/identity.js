import React, { Component } from 'react';
import { Card, Avatar, Menu } from 'antd'
import { Link } from 'react-router-dom';
import { apiClient } from '../shared/api/clients'
import { profileSuccess } from '../reducers/auth';
import { connect } from 'react-redux';
const { Meta } = Card;
const { SubMenu } = Menu;
class Identity extends Component {
    state = {
        homeInfo: {}
    };
    componentDidMount() {
        apiClient.get('service/api/profile/getProfile/1')
            .then(res => {
                const homeInfo = res.data[0];
                this.props.upadateProfile(homeInfo);
                this.setState({ homeInfo: homeInfo });
            })
    }
    render() {
        const { homeInfo } = this.state;
        return (
            <div className="left-rail">
                <Card className="profile-card"
                    actions={[
                        <div className="profile-status">{homeInfo.Friends}<span>Friends</span></div>,
                        <div className="profile-status">{homeInfo.Groups}<span>Groups</span></div>,
                        <div className="profile-status">{homeInfo.Posts}<span>Post</span></div>,
                    ]}
                >
                    <Meta
                        avatar={
                            <Avatar src={homeInfo.ProfilePic} />
                        }
                        title={<div>{homeInfo.FirstName}<span className="premium-icon"></span></div>}
                        description="Groups"
                    />
                </Card>
                <Menu className="menu-items profile-menu" mode="vertical" title="Blackbuck">
                    <Menu.Item key=""><Link to="/profile"><span className="left-menu profile-icon"></span><span>Profile</span></Link></Menu.Item>
                    <Menu.Item key="about"><Link to="/about"><span className="left-menu friends-icon"></span><span>Friends</span></Link></Menu.Item>
                    <Menu.Item key="contact"><Link to="/profile"><span className="left-menu post-icon"></span><span>Posts</span></Link></Menu.Item>
                    <Menu.Item key=""><Link to="/group"><span className="left-menu group-icon"></span><span>Groups</span></Link></Menu.Item>
                    <Menu.Item key="posts"><Link to="/posts"><span className="left-menu noti-icon"></span><span>Notifications</span></Link></Menu.Item>
                </Menu>
            </div>
        )
    }
}
const mapStateToProps = ({ user }) => {
    return { user }
}
const mapDispatchToProps = dispatch => {
    return {
        upadateProfile: (info) => { dispatch(profileSuccess(info)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Identity);