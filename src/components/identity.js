import React, { Component } from 'react';
import { Skeleton, Switch, Card, Avatar, Space, Affix, Menu } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import AvatarImage from '../styles/images/avatar.png';
import { Link } from 'react-router-dom';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
const { Meta } = Card;



const { SubMenu } = Menu;



class Identity extends Component {

    render() {
        return (
            <div className="left-rail">
                <Card className="profile-card"
                    actions={[
                        <div className="profile-status">58<span>Friends</span></div>,
                        <div className="profile-status">8<span>Groups</span></div>,
                        <div className="profile-status">10<span>Post</span></div>,
                    ]}
                >
                    <Meta
                        avatar={
                            <Avatar src={AvatarImage} />
                        }
                        title={<div>John doe<span className="premium-icon"></span></div>}
                        description="Groups"
                    />
                </Card>
                <Menu className="menu-items profile-menu" mode="vertical" title="Blackbuck">
                    <Menu.Item key=""><Link to="/"><span className="left-menu profile-icon"></span><span>Profile</span></Link></Menu.Item>
                    <Menu.Item key="about"><Link to="/about"><span className="left-menu friends-icon"></span><span>Friends</span></Link></Menu.Item>
                    <Menu.Item key="contact"><Link to="/contact"><span className="left-menu post-icon"></span><span>Posts</span></Link></Menu.Item>
                    <Menu.Item key="posts"><Link to="/posts"><span className="left-menu group-icon"></span><span>Groups</span></Link></Menu.Item>
                    <Menu.Item key="posts"><Link to="/posts"><span className="left-menu noti-icon"></span><span>Notifications</span></Link></Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default Identity;