import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import User1 from '../styles/images/avatar.png';
import User2 from '../styles/images/user.jpg';
import User3 from '../styles/images/user_image.jpg';
import User4 from '../styles/images/user-image.jpg';
import { userLogout } from '../reducers/auth';
import '../index.css';
import '../App.css';
const data = [

    {
        avatar: User1,
        title: 'IT Groups',
        members: 6,
    },
    {
        avatar: User2,
        title: 'CSC Champs',
        members: 2,
    },

    {
        avatar: User3,
        title: 'Civili',
        members: 10,
    },
    {
        avatar: User4,
        title: 'Technical Group',
        members: 8,
    },
];
class FriendRequests extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card requests">
                <Card title="Friend Requests" bordered={false} >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar className="request-image" src={item.avatar} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span></div>}
                                    description={<div className="mt-8 d-flex align-items-center">
                                            <span className="list-request">
                                                <Avatar.Group
                                                    maxCount={4}
                                                    size="large"
                                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                                >
                                                    <Avatar src={user} />
                                                    <Avatar src={user} />
                                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                </Avatar.Group>
                                            </span> <span>Mutual Friends</span></div>}
                                />
                                <Link to="" className="f-14 mr-16 list-link">Accept</Link>
                                <Link to="" className="f-14 ml-16 list-remove">Remove</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default FriendRequests;