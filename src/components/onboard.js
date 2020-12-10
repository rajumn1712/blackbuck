import React, { useState } from 'react';
import { Steps, Button, message, Card, List, Avatar, Row, Col, Select, Input, Checkbox, } from 'antd';
import { Link } from 'react-router-dom';
import User1 from '../styles/images/avatar.png';
import User2 from '../styles/images/user.jpg';
import User3 from '../styles/images/user_image.jpg';
import User4 from '../styles/images/user-image.jpg';
import Logo from '../styles/images/blackbugs-logo.png';
import Onboard1 from '../styles/images/onboard1.svg';
import Onboard2 from '../styles/images/onboard2.svg';
import Form from 'antd/lib/form/Form';
import { ErrorMessage, Field, Formik } from 'formik';
import GroupsPage from '../shared/components/GroupsPage';
import Computer from '../styles/images/computer.svg';

function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
}
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
        title: 'Mech',
        members: 21,
    },
];

const steps = [
    {
        content:
            <Row gutter={8}>
                <Col xs={24} md={8}>
                    <div className="intro1">
                        <img src={Logo} alt="blackbuck" width="250px" />
                        <h1> Welcome to Blackbuck</h1>
                        <p>To bring premier and practical formal education closer to students and professionals.</p>
                        <div className="intro-image text-center">
                            <img src={Onboard1} alt="blackbuck" width="200px" />
                        </div>
                    </div>

                </Col>
                <Col xs={24} md={16}>
                    <div className="intro-title">
                        <h2>
                            A bit about you
                        </h2>
                    </div>
                    <div className="intro2">
                        <Form layout="vertical">
                            <Row gutter={16} className="mt-16">

                                <Col xs={24} className="custom-fields">
                                    <label >College/University Name</label>
                                    <Input />
                                </Col>
                                <Col xs={12} className="custom-fields">
                                    <label >Course Name</label>
                                    <Input />
                                </Col>
                                <Col xs={12} className="custom-fields">
                                    <label >Branch Name</label>
                                    <Input />
                                </Col>
                            </Row>
                        </Form>
                    </div >
                </Col>
            </Row>,
    },
    {
        content:
            <Row gutter={8}>
                <Col xs={24} md={8}>
                    <div className="intro1">
                        <img src={Logo} alt="blackbuck" width="250px" />
                        <h1> Welcome to Blackbuck</h1>
                        <p>To bring premier and practical formal education closer to students and professionals.</p>
                        <div className="intro-image text-center">
                            <img src={Onboard2} alt="blackbuck" width="200px" />
                        </div>
                    </div>

                </Col>
                <Col xs={24} md={16}>
                    <div className="intro-title">
                        <h2>Tell us what you are Interested in?</h2>
                        <p>You can select few</p>
                    </div>

                    <div className="intro4">
                        <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                            <Row gutter={8}>
                                <Col span={12}>
                                    <Checkbox className="intro-check" value="Computers"><span><img src={Computer} className="mr-8" /><span>Computers</span></span></Checkbox>
                                </Col>
                                <Col span={12}>
                                    <Checkbox className="intro-check" value="Entertainment"><span><img src={Computer} className="mr-8" /><span>Entertainment</span></span></Checkbox>
                                </Col>
                                <Col span={12}>
                                    <Checkbox className="intro-check" value="Travel"><span><img src={Computer} className="mr-8" /><span>Travel</span></span></Checkbox>
                                </Col>
                                <Col span={12}>
                                    <Checkbox className="intro-check" value="Business"><span><img src={Computer} className="mr-8" /><span>Business</span></span></Checkbox>
                                </Col>
                                <Col span={12}>
                                    <Checkbox className="intro-check" value="Education"><span><img src={Computer} className="mr-8" /><span>Education</span></span></Checkbox>
                                </Col>
                                <Col span={12}>
                                    <Checkbox className="intro-check" value="Health"><span><img src={Computer} className="mr-8" /><span>Health</span></span></Checkbox>
                                </Col>
                                <Col span={12}>
                                    <Checkbox className="intro-check" value="Shopping"><span><img src={Computer} className="mr-8" /><span>Shopping</span></span></Checkbox>
                                </Col>
                                <Col span={12}>
                                    <Checkbox className="intro-check" value="Sports"><span><img src={Computer} className="mr-8" /><span>Sports</span></span></Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </div>
                </Col>
            </Row>

        ,
    },
    {
        content:
            <Row gutter={8}>
                <Col xs={24} md={8}>
                    <div className="intro1">
                        <img src={Logo} alt="blackbuck" width="250px" />
                        <h1>Welcome to Blackbuck</h1>
                        <p>To bring premier and practical formal education closer to students and professionals.</p>
                        <div className="intro-image text-center">
                            <img src={Onboard2} alt="blackbuck" width="200px" />
                        </div>
                    </div>

                </Col>
                <Col xs={24} md={16}>
                    <div className="intro-title">
                        <h2>Want to join in Groups?</h2>
                    </div>
                    <div className="intro3">
                        <GroupsPage />
                    </div>

                </Col>
            </Row>
        ,
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
                <div className="steps-action">
                    <Row>
                        <Col xs={24} md={8}>

                        </Col>
                        <Col xs={24} md={16}>
                            {current > 0 && (
                                <Button className="backbtn" onClick={() => prev()}>
                                    Back
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

                        </Col>
                    </Row>

                </div>
            </Card>
        </>
    );
};

export default OnBoard; 