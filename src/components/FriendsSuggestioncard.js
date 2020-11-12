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
        members:10,
    },
    {
        avatar: User4,
        title: 'Technical Group',
        members:8,
    },
];
class FriendsSuggestioncard extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Friend Suggestions" bordered={false} extra={<Link to="">View all</Link>} >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span></div>}
                                    description={<div><span style={{color:'var(--textprimary)'}}>{item.members}</span> Mutual Friends</div>}
                                />
                                <Link to="" className="f-14 list-link">Accept</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default FriendsSuggestioncard;