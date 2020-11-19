import React, { Component } from 'react';
import { Card, Avatar, List } from 'antd'
import { Link } from 'react-router-dom';
// import { userManager } from '../shared/authentication/auth';
import { store } from '../../store'
import User1 from '../../styles/images/avatar.png';
import User2 from '../../styles/images/user.jpg';
import User3 from '../../styles/images/user_image.jpg';
import User4 from '../../styles/images/user-image.jpg';
// import user from '../styles/images/user.jpg';
// import { userLogout } from '../reducers/auth';
import '../../index.css';
import '../../App.css';
import notify from '../../shared/components/notification';

class FriendRequests extends Component {

    state = {
        friendRequests: [

            {
                avatar: User1,
                title: 'IT Groups',
                members: [
                    { avatar: '', name: 'User', initial: 'U' },
                    { avatar: '', name: 'UserName', initial: 'A' },
                    { avatar: '', name: 'Name', initial: 'B' },
                    { avatar: '', name: 'Name', initial: 'C' },
                    { avatar: '', name: 'Name', initial: 'D' },
                    { avatar: '', name: 'Name', initial: 'E' }
                ],
            },
            {
                avatar: User2,
                title: 'CSC Champs',
                members: [
                    { avatar: '', name: 'User', initial: 'A' },
                    { avatar: '', name: 'User', initial: 'B' },
                    { avatar: '', name: 'User', initial: 'C' },
                    { avatar: '', name: 'User', initial: 'D' },

                ],
            },

            {
                avatar: User3,
                title: 'Civili',
                members: [
                    { avatar: '', name: 'User', initial: 'U' },
                    { avatar: '', name: 'User', initial: 'U' },

                ],
            },
            {
                avatar: User4,
                title: 'Technical Group',
                members: [
                    { avatar: '', name: 'User', initial: 'U' },
                    { avatar: '', name: 'User', initial: 'U' },
                    { avatar: '', name: 'User', initial: 'U' },

                ],
            },
        ]
    }

    handleAccept = () => {
        notify({ placement: 'bottom', message: 'Frien Request', description: 'Request sent successfully.' });
    }

    handleRemove = (index) => {
        const requests = [...this.state.friendRequests];
        requests.splice(index, 1);
        this.setState({ friendRequests: requests });
    }

    render() {
        const { user } = store.getState().oidc;
        const data = [...this.state.friendRequests];

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
                                                {item.members.map((member, index) => {
                                                    return <Avatar src={member.avatar} key={index} style={{ backgroundColor: (member.avatar ? '' : '#f56a00') }}>
                                                        {member.avatar ? null : member.initial}
                                                    </Avatar>
                                                })}
                                            </Avatar.Group>
                                        </span> <span>Mutual Friends</span></div>}
                                />
                                <Link className="f-14 mr-16 list-link" onClick={this.handleAccept}>Accept</Link>
                                <Link className="f-14 ml-16 list-remove" onClick={(index)=>this.handleRemove(index)}>Remove</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default FriendRequests;