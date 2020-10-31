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
                        title="John Doe"
                        description="Groups"
                    />
                </Card>
                <Menu className="menu-items profile-menu" mode="vertical" title="Blackbuck">
                    <Menu.Item key=""><Link to="/"><i className="left-menu profile-icon"></i><span>Profile</span></Link></Menu.Item>
                    <Menu.Item key="about"><Link to="/about"><i className="left-menu friends-icon"></i><span>Friends</span></Link></Menu.Item>
                    <Menu.Item key="contact"><Link to="/contact"><i className="left-menu post-icon"></i><span>Posts</span></Link></Menu.Item>
                    <Menu.Item key="posts"><Link to="/posts"><i className="left-menu group-icon"></i><span>Groups</span></Link></Menu.Item>
                    <Menu.Item key="posts"><Link to="/posts"><i className="left-menu noti-icon"></i><span>Notifications</span></Link></Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default Identity;