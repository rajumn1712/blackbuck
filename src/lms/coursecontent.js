import React, { Component } from 'react';
import { Card, List, Row, Col, Carousel, Collapse, Avatar, Tabs } from 'antd'
import { Link } from 'react-router-dom';
import comingsoon from '../styles/images/coming-soon.png'
import { CaretRightOutlined } from '@ant-design/icons';
import '../index.css';
import '../App.css';
import video from '../styles/images/video.mp4';
import OverView from './overview';
import { fetchCourseDetails } from './api';
const { Panel } = Collapse;
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
    state = {
        courseDetails: {},
        loading: true,
        selectedVideo: null
    }
    componentDidMount() {
        this.loadCourseDetails();
    }
    loadCourseDetails = async () => {
        const response = await fetchCourseDetails(this.props.match.params.id);
        if (response.ok) {
            this.setState({ ...this.state, courseDetails: response.data[0], loading: false });
        }
    }
    setVideoSource = (src) => {
        debugger
        let source = document.createElement("source");
        let videoEle = document.querySelector("video");
        // videoEle.removeChild("source");
        source.setAttribute("src",src);
        videoEle.appendChild(source);
        videoEle.play();
    }
    render() {
        return (
            <div className="post-preview-box post-card course-card" >
                <Row gutter={24} className="py-16">
                    <Col className="" xs={24} sm={16} md={16} lg={17} >
                        <div className="preview-image">
                            <Carousel>
                                <div className="lms-video mb-8">
                                    <video controls>
                                        <source src={this.state.selectedVideo} />
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
                                <div className="height-scroll">
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={['1']}
                                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                        className="site-collapse-custom-collapse"
                                        expandIconPosition="right"
                                    >
                                        {this.state.courseDetails?.CourseSections?.map((section, indx) => <Panel key={indx} header={section.SectionName} key={indx} className="pb-0 course-content flot-left" >
                                            <div className="panel-subtext px-16"><span>4/5</span> | <span>23min</span> </div>
                                            <div>
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={section.Topics}
                                                    renderItem={item => (
                                                        <List.Item extra={<span className="icon playover-icon"></span>}>
                                                            <List.Item.Meta
                                                                title={<a onClick={() => this.setVideoSource(item.VideoUrl[0])}>{item.Title}</a>}
                                                                description={<div className="f-12"><span className="grp-type-icon video-play"></span> {item.Description}</div>}
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                        </Panel>)}

                                    </Collapse></div>
                            </Card>
                        </div>

                    </Col>
                </Row>
            </div>
        )
    }
}
export default CourseContent;