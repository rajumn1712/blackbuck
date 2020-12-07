import React, { useState } from 'react';
import { Steps, Button, message, Card, List, Avatar, Row, Col, Select, Input, } from 'antd';
import { Link } from 'react-router-dom';
import User1 from '../styles/images/avatar.png';
import User2 from '../styles/images/user.jpg';
import User3 from '../styles/images/user_image.jpg';
import User4 from '../styles/images/user-image.jpg';
import Logo from '../styles/images/blackbugs-logo.png';

import Form from 'antd/lib/form/Form';
import { ErrorMessage, Field, Formik } from 'formik';


// const { Step } = Steps;.
const data = [

    {
        avatar: User1,
        title: 'IT Groups',
        members: 161,
    },
    {
        avatar: User2,
        title: 'CSC Champs',
        members: 18,
    },

    {
        avatar: User3,
        title: 'Civili',
        members: 21,
    },
    {
        avatar: User4,
        title: 'Technical Group',
        members: 3,
    },
];

const steps = [
    {
        content: <div className="intro1">
            <img src={Logo} alt="blackbuck" width="250px" />
            <h1> Welcome to Blackbuck</h1>
            <p>To bring premier and practical formal education closer to students and professionals.</p>
        </div>,
    },
    {
        content: <div className="step1">
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <label >College/University Name</label>
                        <Input />
                    </Col>
                    <Col xs={24} sm={12}>
                        <label  >Course Name</label>
                        <Input />
                    </Col>
                    <Col xs={24} sm={12}>
                        <label  >Place</label>
                        <Input />
                    </Col>

                </Row>
            </Form>
        </div >,
    },
    {
        content: <Card className="custom-card" bordered={false} >
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={<div className="d-flex align-items-center"><span className="overflow-text">{item.title}</span><span className="icons-small lock-icon ml-4" /></div>}
                            description={<div><div><span style={{ color: 'var(--textprimary)' }}>{item.members}</span> Members</div></div>}
                        />
                        <Link to="" className="f-14 list-link">Join group</Link>
                    </List.Item>
                )}
            />
        </Card>,
    },

];

const OnBoard = () => {
    const [current, setCurrent] = React.useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    return (
        <>
            <Card className="mb-6 custom-card onboard-process" bordered={true} >
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action ">
                    {current > 0 && (
                        <Button className="backbtn" onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            Finish
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                </div>
            </Card>
        </>
    );
};

export default OnBoard; 