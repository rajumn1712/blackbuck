import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, Tag } from 'antd'
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

class Hobbies extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Hobbies" className="hobbies-card" bordered={false} extra={<Link to=""><span className="icons edit" /></Link>} >
                    <Tag className="tags">Playing Cricket</Tag>
                    <Tag className="tags">Reading Books</Tag>
                    <Tag className="tags">Watching Movies</Tag>
                </Card>
            </div>
        )
    }
}
export default Hobbies;