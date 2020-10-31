import React, { Component } from 'react';
import { Skeleton, Switch, Card, Avatar, Space, Affix, Menu } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import AvatarImage from '../styles/images/avatar.png';
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
                
            </div>
        )
    }
}

export default Identity;