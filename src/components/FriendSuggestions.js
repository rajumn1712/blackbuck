import React, { Component } from 'react';
import { Typography, UserAddOutlined } from 'antd';
import user from '../styles/images/user.jpg';

const { Title, Paragraph, Link } = Typography;
class  FriendSuggestions extends Component {
    render() {
        return (
            <div>
                <div className="friends-thead">
                    <Title level={5}>Friend Requests</Title><div className="link-color"><a href="" className="link-color">View all</a></div>
                </div>
                <div className="friends">
                    <div className="friends-list">
                        <img src={user} width="100%" height="100%" />
                        <div className="friends-list--name">
                            <Paragraph>Vin Diesel</Paragraph>
                            <Paragraph className="friends-list--course">IT</Paragraph>
                        </div>
                        <div className="addfrnd-btn">
                        </div>
                    </div>
                    <div className="friends-list one">
                        <img src={user} width="100%" height="100%" />
                        <div className="friends-list--name">
                            <Paragraph className="_name">Andrew</Paragraph>
                            <Paragraph className="friends-list--course">CSE</Paragraph>
                        </div>
                        <div className="addfrnd-btn">
                        </div>
                    </div>
                    <div className="friends-list two">
                        <img src={user} width="100%" height="100%" />
                        <div className="friends-list--name">
                            <Paragraph className="_name">Andrew</Paragraph>
                            <Paragraph className="friends-list--course">CSE</Paragraph>
                        </div>
                        <div className="addfrnd-btn">
                        </div>
                    </div>
                    <div className="friends-list">
                        <img src={user} width="100%" height="100%" />
                        <div className="friends-list--name">
                            <Paragraph>Vin Diesel</Paragraph>
                            <Paragraph className="friends-list--course">IT</Paragraph>
                        </div>
                        <div className="addfrnd-btn">
                        </div>
                    </div>
                    <div className="friends-list one">
                        <img src={user} width="100%" height="100%" />
                        <div className="friends-list--name">
                            <Paragraph className="_name">Andrew</Paragraph>
                            <Paragraph className="friends-list--course">CSE</Paragraph>
                        </div>
                        <div className="addfrnd-btn">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default FriendSuggestions;