import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal, Card, Avatar, List, message, Spin, Divider } from 'antd'
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
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
const { Header } = Layout;
const { Meta } = Card;
const data = [

    {
        avatar: User1,
        title: 'IT Groups',
        description: '',
        members: 161,
    },
    {
        avatar: User2,
        title: 'CSC Champs',
        description: '',
        members: 161,
    },

    {
        avatar: User3,
        title: 'Civili',
        description: 'created many changes with CBU...',
        members: 161,
    },
    {
        avatar: User4,
        title: 'Technical Group',
        description: '',
        members: 161,
    },
];
class Groups extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Groups" bordered={false} extra={<Link to="">View all</Link>} >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span><span className="icons-small lock-icon" /></div>}
                                    description={<div><div className="overflow-text">{item.description}</div><div><span style={{color:'var(--textprimary)'}}>{item.members}</span> Members</div></div>}
                                />
                                <Link to="" className="f-12 list-link">Join group</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default Groups;