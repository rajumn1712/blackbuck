import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, Divider, Row, Col } from 'antd'
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
        description: '',
        members: 161,
    },
    {
        avatar: User2,
        title: 'CSC Champs',
        description: '',
        members: 18,
    },

    {
        avatar: User3,
        title: 'Civili',
        description: 'created many changes with CBU...',
        members: 21,
    },
    {
        avatar: User4,
        title: 'Technical Group',
        description: '',
        members: 3,
    },
];
class About extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="About Me" bordered={false} extra={<Link to=""><span className="icons edit" /></Link>} actions={[
                    <Button type="primary" >Download Profile as PDF</Button>
                ]} >
                    <div>
                        <p>Although social distancing has created many changes with CBU courses, we are still offering a wide range of classes virtually.</p>
                        <Divider className="text-left-line" orientation="left">Contact</Divider>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <div className="about-details">
                                    <div className="about-icons">
                                        <span className="icons location" />
                                    </div>
                                    <p>Mr. I. K. Taneja Flat No. 100, Triveni Apartments Pitam Pura, TG - 500049</p>
                                </div>

                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="about-details">
                                    <div className="about-icons">
                                        <span className="icons phone" />
                                    </div>
                                    <p>+91 9015245810</p>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="about-details">
                                    <div className="about-icons">
                                        <span className="icons email" />
                                    </div>
                                    <p>JohnDoe@blackbuck.com</p>
                                </div>
                            </Col>
                        </Row>

                    </div>

                </Card>
            </div>

        )
    }
}
export default About;