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
class FriendsRequestsCard extends Component {
    state = {
        lstFriendsRequests: [
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
        ]
    }
    render() {
        const { user } = store.getState().oidc;
        const { lstFriendsRequests } = this.state;
        return (
            <div className="custom-card">
                <Card title="Friend Requests" bordered={false} extra={<a className="f-14 list-link">View all</a>} >
                    <List
                        itemLayout="horizontal"
                        dataSource={lstFriendsRequests}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span></div>}
                                    description={<div><span style={{ color: 'var(--textprimary)' }}>{item.members}</span> Mutual Friends</div>}
                                />
                                <a className="f-14 list-link" >Accept</a>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default FriendsRequestsCard;