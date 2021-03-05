import React, { Component } from 'react';
import { Layout, Typography } from 'antd';
import user from '../../styles/images/user.jpg'
const { Title } = Typography;
class Stories extends Component {
    render() {
        return (
            <ul className="stories">
                <li className="story-card">
                    <div className="story-image">
                        <div className="add-story">
                            <span className="add-story-icon" />
                        </div>
                    </div>
                    <p className="name">Add Story</p>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
                <li className="story-card">
                    <div className="story-image">
                        <img src={user} />
                    </div>
                    <p className="name">William Smith</p>
                </li>
            </ul>
        )
    }
}
export default Stories;