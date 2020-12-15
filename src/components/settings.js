import React, { Component } from 'react';
import { Col, Collapse, Row, Card, Button, List, Avatar, Space,Typography  } from 'antd';
import { Link } from 'react-router-dom';
import { store } from '../store'
import '../index.css';
import '../App.css';
import { connect } from 'react-redux';
import Search from 'antd/lib/input/Search';
import { CaretRightOutlined } from '@ant-design/icons';
import AccSettings from '../styles/images/acc-settings.svg';
import Password from '../styles/images/password.svg';
import Privacy from '../styles/images/privacy.svg';
import Item from 'antd/lib/list/Item';
const { Panel } = Collapse;

function callback(key) {
    console.log(key);
}
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const data = [
    {
        title: 'How Blackbuck uses your data',
        description: 'Manage how your data is used and download it anytime',
    },
];
const { Title } = Typography;
class Settings extends Component {

    render() {

        return (
            <div>
                <Row justify="center">

                    <Col xs={24} md={16} className="mt-16">

                        {/* <Card title="General Account Settings"  bordered={true}  >
                            
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta 
                                            title={<a>{item.title}</a>}
                                            description={item.description}
                                        /><Link className="ml-8 f-12 list-link ml-16">Change</Link>
                                        {/* <Link className="ml-8 f-12 list-link ml-16">Close</Link> */}
                        {/* </List.Item>
                                )}
                            />
                        </Card> */}
                        <Card  bordered={true}  >
                            <Title className="fw-400 mb-0" level={2}>How Blackbuck uses your data</Title>
                            <div className="f-16">Manage how your data is used and download it anytime</div>
                            <Collapse
                                bordered={false}
                                defaultActiveKey={['1']}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                className="site-collapse-custom-collapse"
                                expandIconPosition="right"
                            >
                                <Panel header="Manage your data and activity" key="1" className="site-collapse-custom-panel">
                                    <p>{text}</p>
                                    <Collapse defaultActiveKey={['1']}
                                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                        className="site-collapse-custom-collapse"
                                        expandIconPosition="right">
                                        <Panel header="This is panel nest panel" key="1">
                                            <p>{text}</p>
                                        </Panel>
                                        <Panel header="This is panel nest panel" key="1">
                                            <p>{text}</p>
                                        </Panel>
                                        <Panel header="This is panel nest panel" key="1">
                                            <p>{text}</p>
                                        </Panel>
                                        <Panel header="This is panel nest panel" key="1">
                                            <p>{text}</p>
                                        </Panel>

                                    </Collapse>
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
                        </Card>

                    </Col>



                </Row>

            </div>


        )
    }
}

export default Settings;