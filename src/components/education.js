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
import { Meta } from 'antd/lib/list/Item';
const data = [

    {
        avatar: User1,
        title: 'IT Groups',
        description: '',
        members: 161,
    },
];
class Education extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Education" bordered={false} extra={<Link to=""><span className="icons add" /></Link>} >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <div className="edu-card">
                                <Meta
                                    className="edu-study"
                                    avatar={<div className="about-icons">
                                        <span className="icons location" />
                                    </div>}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">St.Ann's intermediate junior college</span></div>}
                                    description={<div><span style={{ color: 'var(--textprimary)' }}></span> 2010 - 2012 | <span style={{ color: 'var(--textprimary)' }}></span>Hyderabad</div>}
                                />
                                <Meta
                                    className="edu-certificate"
                                    avatar={<div className="about-icons">
                                        <span className="icons location" />
                                    </div>}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">Inter Marks memo.jpeg</span></div>}
                                />
                                <Link to="" className="f-12 list-link"><span className="icons edit" /></Link>
                            </div>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default Education;