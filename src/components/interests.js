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
        title: 'Indian Cricket Team',
        members: 2,
    },
    {
        avatar: User2,
        title: 'Pan India Movies',
        members: 10,
    },

    {
        avatar: User3,
        title: 'Pan India Movies',
        members: 21,
    },
    {
        avatar: User4,
        title: 'Indian Cricket Team',
        members: 3,
    },
];
class Interests extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Interests" bordered={false} extra={<Link to=""><span className="icons add" /></Link>}  >
                    <List
                        grid={{ gutter: 16, column:2 }}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span></div>}
                                    description={<div><span style={{ color: 'var(--textprimary)' }}>{item.members}</span> Mutual Friends</div>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default Interests;