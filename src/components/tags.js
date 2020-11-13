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
    {title: '#IPL'},
    {title: '#COVID-19'},
    {title: '#HBD@PK'},
    {title: '#RRRMovie'},
    {title: '#IPL 2020'}
];
class FriendRequests extends Component {

    render() {
        return (
            <div className="custom-card requests">
                <Card title="#Tags" bordered={false} >
                <List
                    itemLayout="vertical"
                    dataSource={data}
                    renderItem={item => (
                    <div className="tag-color">{item.title}</div>
                   
                    )}
                    />
                </Card>
            </div>

        )
    }
}
export default FriendRequests;