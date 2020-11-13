import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, Tag } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import User1 from '../styles/images/avatar.png';
import User2 from '../styles/images/user.jpg';
import User3 from '../styles/images/user_image.jpg';
import User4 from '../styles/images/user-image.jpg';
import Video from '../styles/images/video.mp4';
import { userLogout } from '../reducers/auth';
import '../index.css';
import '../App.css';

class VideoProfile extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Video as Profile" className="pfvideocard" cover={<video width="100%" controls src="https://archive.org/download/Popeye_forPresident/Popeye_forPresident_512kb.mp4">
                    </video>} bordered={false} extra={<Link to=""><span className="icons edit" /></Link>} >
                </Card>
            </div>
        )
    }
}
export default VideoProfile;