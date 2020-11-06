import React, { Component } from 'react';
import { Skeleton, Switch, Card, Avatar, Space, Affix, Menu, Button } from 'antd'
import AvatarImage from '../styles/images/avatar.png';
import { Link } from 'react-router-dom';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { SmileOutlined, AntDesignOutlined } from '@ant-design/icons';
import { notification, Divide } from 'antd';

const openNotification = (placement) => {
    notification.open({
        message: 'Invite',
        description:
            'Request Accepted successfully.',
        style: {
            width: 300,
        },
        placement,
    });
};


class Invite extends React.Component {


    render() {
        return (
            <div className="invite-card">
                <Card title="Invite" bordered={false}>
                    <Avatar.Group>
                        <Avatar style={{ backgroundColor: '#D7FDFE' }}>Me</Avatar>
                        <Avatar src={AvatarImage} />
                    </Avatar.Group>
                    <p><span>Vin Diesel</span> was invited to join in <span className="text-color">Mech Mantra</span> group</p>
                    <Button type="primary" onClick={() => openNotification('bottomLeft')}>Accept Request</Button>

                </Card>
            </div>
        )
    }
}

export default Invite;