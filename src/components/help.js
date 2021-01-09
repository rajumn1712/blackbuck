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
                    <Col xs={24} md={16} className="my-16">
                        <h3 className="sub-title">
                            Popular Questions
                        </h3>
                        <div className="card-background px-0">
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
                            <Panel header="How do I add to or edit the Intro section of my Blackbuck profile?" key="4" className="site-collapse-custom-panel border-none">
                                <p>{text}</p>
                            </Panel>
                        </Collapse>
                        </div>
                    </Col>
                    <Col xs={24} md={16} className="mb-16">
                        <h3 className="sub-title">
                            Help by category
                        </h3>
                        <Row gutter={8}>
                            <Col xs={24} md={12} lg={8}>
                                <div className="helpcards">
                                <h3>Contact</h3>
                                    <img src={AccSettings}/>
                                    <p><span>Email:</span> welcome@gmail.com</p>
                                </div>
                            </Col>
                            <Col xs={24} md={12} lg={8} >
                                <div className="helpcards">
                                <h3>Phone</h3>
                                    <img src={Password}/>
                                    <p><span>Phone:</span> 258963647</p>
                                </div>
                            </Col>
                            <Col xs={24} md={12} lg={8} >
                                <div className="helpcards">
                                    <h3>Settings</h3>
                                    <img src={Privacy}/>
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