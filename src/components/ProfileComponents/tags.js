import React, { Component } from 'react';
import { Card, List } from 'antd'
// import { Link } from 'react-router-dom';
// import { userManager } from '../../shared/authentication/auth';
// import { store } from '../../store'
// import User1 from '../styles/images/avatar.png';
// import User2 from '../styles/images/user.jpg';
// import User3 from '../styles/images/user_image.jpg';
// import User4 from '../styles/images/user-image.jpg';
// import { userLogout } from '../../reducers/auth';
import '../../index.css';
import '../../App.css';

class FriendRequests extends Component {

    state = {
        tags:[]
    }

    render() {

        const {tags} = this.state;
        return (
            <div className="custom-card requests">
                <Card title="#Tags" bordered={false} >
                <List
                    itemLayout="vertical"
                    dataSource={tags}
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