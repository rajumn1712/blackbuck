import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../../shared/authentication/auth';
import { store } from '../../store'
import User1 from '../../styles/images/avatar.png';
import User2 from '../../styles/images/user.jpg';
import User3 from '../../styles/images/user_image.jpg';
import User4 from '../../styles/images/user-image.jpg';
import { userLogout } from '../../reducers/auth';
import '../../index.css';
import '../../App.css';
import { apiClient } from '../api/clients';
import notify from './notification';
class FriendRequests extends Component {
    state = {
        lstFriendsRequests: [
            {
                avatar: User1,
                title: 'IT Groups',
                members: 6,
                mutulFnds: [User1, User1, User1, User1]
            },
            {
                avatar: User2,
                title: 'CSC Champs',
                members: 2,
                mutulFnds: [User1, User1, User1, User1]
            },
            {
                avatar: User3,
                title: 'Civili',
                members: 2,
                mutulFnds: [User1, User1, User1, User1]
            },
            {
                avatar: User4,
                title: 'Technical Group',
                members: 2,
                mutulFnds: [User1, User1, User1, User1]
            },
        ],
    }
    acceptRequest = () => {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            notify({ placement: 'bottomLeft', message: 'Invite', description: 'Request declined successfully.' });
        });
    }
    removeRequest = () => {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            notify({ placement: 'bottomLeft', message: 'Invite', description: 'Request declined successfully.' });
        });
    }

    render() {
        const { user } = store.getState().oidc;
        const { lstFriendsRequests } = this.state;
        return (
            <div className="custom-card requests">
                <Card title="Friend Requests" bordered={false} >
                    <List
                        itemLayout="horizontal"
                        dataSource={lstFriendsRequests}
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
                                                {item.mutulFnds.map((friend, index) => {
                                                    return <Avatar key={index} src={friend} />
                                                })
                                                }
                                            </Avatar.Group>
                                        </span> <span>Mutual Friends</span></div>}
                                />
                                <a className="f-14 mr-16 list-link" onClick={() => this.acceptRequest()}>Accept</a>
                                <a className="f-14 ml-16 list-remove" onClick={() => this.removeRequest()}>Remove</a>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default FriendRequests;