import React, { Component } from 'react';
import { Col, Collapse, Row, Space } from 'antd';
import { store } from '../store'
import '../index.css';
import '../App.css';
import { connect } from 'react-redux';
import Search from 'antd/lib/input/Search';
import { CaretRightOutlined } from '@ant-design/icons';
import AccSettings from '../styles/images/acc-settings.svg';
import Password from '../styles/images/password.svg';
import Privacy from '../styles/images/privacy.svg';


const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class Help extends Component {

    render() {

        return (
            <div className="helppage">
                <Row justify="center">
                    <Col xs={24} md={12} className="mb-16">
                        <div className="help-search">
                            <h2>How can we help you?</h2>
                            <Search className="header-searchbar" placeholder="Write a question or problem" />
                        </div>
                    </Col>
                    <Col xs={24} md={16} className="mb-16">
                        <h3 className="sub-title">
                            Popular Questions
                        </h3>
                        <Collapse
                            bordered={false}
                            defaultActiveKey={['1']}
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                            className="site-collapse-custom-collapse"
                            expandIconPosition="right"
                        >
                            <Panel header="Where can I find my Blackbuck settings?" key="1" className="site-collapse-custom-panel">
                                <p>{text}</p>
                            </Panel>
                            <Panel header="How do I add or remove an email from my Blackbuck account?" key="2" className="site-collapse-custom-panel">
                                <p>{text}</p>
                            </Panel>
                            <Panel header="How do I add or remove a mobile phone number from my Blackbuck account?" key="3" className="site-collapse-custom-panel">
                                <p>{text}</p>
                            </Panel>
                            <Panel header="How do I add to or edit the Intro section of my Blackbuck profile?" key="4" className="site-collapse-custom-panel">
                                <p>{text}</p>
                            </Panel>
                        </Collapse>
                    </Col>
                    <Col xs={24} md={16} className="mb-16">
                        <h3 className="sub-title">
                            Help by category
                        </h3>
                        <Row gutter={8}>
                            <Col xs={24} md={12} lg={8}>
                                <div className="helpcards">
                                    <img src={AccSettings}/>
                                    <h3>Account Settings</h3>
                                    <p>Adjust settings, manage notifications, learn about name changes and more.</p>
                                </div>
                            </Col>
                            <Col xs={24} md={12} lg={8} >
                                <div className="helpcards">
                                    <img src={Password}/>
                                    <h3>Login and Password</h3>
                                    <p>Fix login issues and learn how to change or reset your password.</p>
                                </div>
                            </Col>
                            <Col xs={24} md={12} lg={8} >
                                <div className="helpcards">
                                    <img src={Privacy}/>
                                    <h3>Privacy and Security</h3>
                                    <p>Control who can see what you share and add extra protection to your account.</p>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </div>


        )
    }
}

export default Help;