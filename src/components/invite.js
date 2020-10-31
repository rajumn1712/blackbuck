import React, { Component } from 'react';
import { Skeleton, Switch, Card, Avatar, Space, Affix, Menu, Button } from 'antd'
import AvatarImage from '../styles/images/avatar.png';
import { Link } from 'react-router-dom';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { SmileOutlined, AntDesignOutlined } from '@ant-design/icons';

class Invite extends Component {

    render() {
        return (
            <div className="invite-card">
                <Card title="Invite" bordered={false}>
                    <Avatar.Group>
                        <Avatar style={{ backgroundColor: '#D7FDFE' }}>Me</Avatar>
                        <Avatar src={AvatarImage} />
                    </Avatar.Group>
                    <p><span>Vin Diesel</span> was invited to join in <span>Mech Mantra group</span></p>
                    <Button type="primary">Accept Request</Button>
                </Card>
            </div>
        )
    }
}

export default Invite;