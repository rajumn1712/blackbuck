import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import User1 from '../styles/images/avatar.png';
import User2 from '../styles/images/user.jpg';
import User3 from '../styles/images/user_image.jpg';
import user from '../styles/images/user.jpg';
import User4 from '../styles/images/user-image.jpg';
import { userLogout } from '../reducers/auth';
import '../index.css';
import '../App.css';
import { apiClient } from '../shared/api/clients';
class Friends extends Component {
    componentDidMount() {
        apiClient.get('service/api/profile/getUserFriends/1')
            .then(res => {
                const friendsInfo = res.data[0];
                this.setState({ FriendsList: friendsInfo });
            })
    }
    state = {
        FriendsList: [
            // {
            //     avatar: User1,
            //     title: 'St Ann',
            //     members: 6,
            //     mutulFnds: [user, user, user, user]
            // },
            // {
            //     avatar: User2,
            //     title: 'Mohan',
            //     members: 2,
            //     mutulFnds: [user, user, user, user]
            // },
            // {
            //     avatar: User1,
            //     title: 'Jain',
            //     members: 6,
            //     mutulFnds: [user, user, user, user]
            // },
            // {
            //     avatar: User2,
            //     title: 'Poul',
            //     members: 2,
            //     mutulFnds: [user, user, user, user]
            // },
            // {
            //     avatar: User1,
            //     title: 'Jake',
            //     members: 6,
            //     mutulFnds: [user, user, user, user]
            // },
            // {
            //     avatar: User2,
            //     title: 'Calvin',
            //     members: 2,
            //     mutulFnds: [user, user, user, user]
            // },
            // {
            //     avatar: User1,
            //     title: 'Disee',
            //     members: 6,
            //     mutulFnds: [user, user, user, user]
            // },
            // {
            //     avatar: User2,
            //     title: 'Cruise',
            //     members: 2,
            //     mutulFnds: [user, user, user, user]
            // },

        ],
    }
    render() {
        const { user } = store.getState().oidc;
        const { FriendsList } = this.state;
        return (
            <div className="custom-card requests">
                <Card title="Friends" bordered={false} >
                    <List grid={{
                        gutter: 16,
                        column: 2,
                        xs: 1,
                        md: 2,
                    }}
                        itemLayout="horizontal"
                        dataSource={FriendsList}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar className="request-image" src={item.Image} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.Firstname}</span></div>}
                                    description={
                                        <div className="mt-8 d-flex align-items-center">
                                            <span className="list-request">
                                                <Avatar.Group
                                                    maxCount={4}
                                                    size="large"
                                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                                >
                                                    {item.mutulFnds?.map((friend, index) => {
                                                        return <Avatar key={index} src={friend} />
                                                    })
                                                    }
                                                </Avatar.Group>
                                            </span>
                                            {item.mutulFnds && <span>Mutual Friends</span>}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default Friends;