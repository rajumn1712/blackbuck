import React, { Component } from 'react';
import { Card, List, Row, Col, Carousel, Collapse, Avatar, Tabs } from 'antd'
import { Link } from 'react-router-dom';
import comingsoon from '../styles/images/coming-soon.png'
import { CaretRightOutlined } from '@ant-design/icons';
import '../index.css';
import '../App.css';
import { Checkbox } from 'antd';
import video from '../styles/images/video.mp4';
import QandA from './QandA';
import OverView from './overview';
const { Panel } = Collapse;
const { TabPane } = Tabs;
const data = [
    {
        title: '1. Ant Design Title ',
        description: '5min'
    },
    {
        title: '2. Ant Design Title ',
        description: '3min'
    },
    {
        title: '3. Ant Design Title ',
        description: '2min'
    },
    {
        title: '4. Ant Design Title ',
        description: '5min'
    },
];

class CourseContent extends Component {

    render() {

        function onChange(e) {
            console.log(`checked = ${e.target.checked}`);
        }
        return (
            <div className="post-preview-box post-card course-card" >
                <Row gutter={24} className="py-16">
                    <Col className="" xs={24} sm={16} md={16} lg={17} >
                        <div className="preview-image">
                            <Carousel>
                                <div className="lms-video mb-8">
                                    <video controls>
                                        <source src={video} />
                                    </video>
                                </div>
                            </Carousel>
                        </div>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <OverView />
                            </Col>
                        </Row>

                        {/* <Tabs defaultActiveKey="1"
                            className="group-tabs profile-tabs">
                            <TabPane tab="Overview" key="1">
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <OverView />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Q&A" key="2">
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <div>
                                        <QandA />
                                    </div>
                                    </Col>
                                </Row>
                            </TabPane> */}
                        {/* <TabPane tab="Comments" key="3">
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                                    </Col>
                                </Row>
                            </TabPane> */}
                        {/* </Tabs>*/}
                    </Col>
                    <Col className="p-0" xs={24} sm={8} md={8} lg={7}>
                        <div className="custom-card video-card">
                            <Card title="Course Content" bordered={false} >

                                <Collapse
                                    bordered={false}
                                    defaultActiveKey={['1']}
                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                    className="site-collapse-custom-collapse"
                                    expandIconPosition="right"
                                >
                                    <Panel header="What is JavaScript? How does JavaScript work?" key="1" className="pb-0 course-content flot-left" >
                                        <div className="panel-subtext px-16"><span>4/5</span> | <span>23min</span> </div>
                                        <div>
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={data}
                                                renderItem={item => (
                                                    <List.Item extra={<span className="icon playover-icon"></span>}>
                                                        <List.Item.Meta
                                                            title={<a href="https://ant.design">{item.title}</a>}
                                                            description={<div className="f-12"><span className="grp-type-icon vedio-play"></span> {item.description}</div>}
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
                                    </Panel>
                                    <Panel header="Chapter 1 Introduction to JavaScript" key="1" className="pb-0 course-content flot-left" >
                                        <div className="panel-subtext px-16"><span>4/5</span> | <span>23min</span> </div>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={data}
                                            renderItem={item => (
                                                <List.Item extra={<span className="icon play-icon"></span>}>
                                                    <List.Item.Meta
                                                        title={<a href="https://ant.design">{item.title}</a>}
                                                        description={<div className="f-12"><span className="grp-type-icon lessons"></span> {item.description}</div>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                    <Panel header="Chapter 2 Introduction to JavaScript" key="1" className="pb-0 course-content flot-left" >
                                        <div className="panel-subtext px-16"><span>4/5</span> | <span>23min</span> </div>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={data}
                                            renderItem={item => (
                                                <List.Item extra={<span className="icon play-inprogress"></span>}>
                                                    <List.Item.Meta

                                                        title={<a href="https://ant.design">{item.title}</a>}
                                                        description={<div className="f-12"><span className="grp-type-icon vedio-play"></span> {item.description}</div>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                    <Panel header="Chapter 3 Introduction to JavaScript" key="1" className="pb-0 course-content flot-left" >
                                        <div className="panel-subtext px-16"><span>4/5</span> | <span>23min</span> </div>
                                        <List className=""
                                            itemLayout="horizontal"
                                            dataSource={data}
                                            renderItem={item => (
                                                <List.Item extra={<span className="icon playover-icon"></span>}>
                                                    <List.Item.Meta

                                                        title={<a href="https://ant.design">{item.title}</a>}
                                                        description={<div className="f-12"><span className="grp-type-icon vedio-play"></span> {item.description}</div>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                </Collapse>
                            </Card>
                        </div>

                    </Col>
                </Row>
            </div>
        )
    }
}
export default CourseContent;