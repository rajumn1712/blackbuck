import React, { Component } from 'react';
import { Card, List, Row, Col, Carousel, Collapse,Avatar,Tabs } from 'antd'
import { Link } from 'react-router-dom';
import comingsoon from '../styles/images/coming-soon.png'
import { CaretRightOutlined } from '@ant-design/icons';
import '../index.css';
import '../App.css';
import { Checkbox } from 'antd';
const { Panel } = Collapse;
const { TabPane } = Tabs;
const data = [
    {
      title: '1. Ant Design Title ',
      description:'5min'
    },
    {
      title: '2. Ant Design Title ',
      description:'3min'
    },
    {
      title: '3. Ant Design Title ',
      description:'2min'
    },
    {
      title: '4. Ant Design Title ',
      description:'5min'
    },
  ];

class CourseContent extends Component {

    render() {

        function onChange(e) {
            console.log(`checked = ${e.target.checked}`);
          }
        return (
            <div className="post-preview-box post-card comment-show">
                <Row gutter={24}>
                    <Col className="p-0" xs={24} sm={16} md={16} lg={17} >
                        <div className="preview-image">
                            <Carousel>
                                <div>
                                    <img src={comingsoon} />
                                </div>
                            </Carousel>
                        </div>
                        <Tabs defaultActiveKey="1"
                            className="group-tabs profile-tabs">
                            <TabPane tab="Overview" key="1">
                              <Row gutter={16}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                  
                                </Col>
                              </Row>
                            </TabPane>
                            <TabPane tab="Q&A" key="2">
                              <Row gutter={16}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                
                                </Col>
                              </Row>
                            </TabPane>
                            <TabPane tab="Notes" key="3">
                              <Row gutter={16}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                 
                                </Col>
                              </Row>
                            </TabPane>
                          </Tabs>
                    </Col>
                    <Col className="p-0" xs={24} sm={8} md={8} lg={7}>
                        <div className="custom-card tag-card">
                            <Card title="Course Content" bordered={false} >

                                <Collapse
                                    bordered={false}
                                    defaultActiveKey={['1']}
                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                    className="site-collapse-custom-collapse"
                                    expandIconPosition="right"
                                >
                                    <Panel header="Section 1: Welcome, Welcome, Welcome!" key="1" className="pb-0 course-content">
                                        <div>
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={data}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            avatar={<Checkbox onChange={onChange}></Checkbox>}
                                                            title={<a href="https://ant.design">{item.title}</a>}
                                                            description={<div className="f-12"><span className="grp-type-icon vedio-play"></span> {item.description}</div>}
                                                        />
                                                    </List.Item>
                                                )}
                                            />,
                                        </div>
                                    </Panel>
                                    <Panel header="Section 2: Welcome, Welcome, Welcome!" key="2" className="pb-0 course-content">
                                    <List
                                                itemLayout="horizontal"
                                                dataSource={data}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            avatar={<Checkbox onChange={onChange}></Checkbox>}
                                                            title={<a href="https://ant.design">{item.title}</a>}
                                                            description={<div className="f-12"><span className="grp-type-icon vedio-play"></span> {item.description}</div>}
                                                        />
                                                    </List.Item>
                                                )}
                                            />,
                                    </Panel>
                                    <Panel header="Section 3: Welcome, Welcome, Welcome!" key="3" className="pb-0 course-content">
                                    <List
                                                itemLayout="horizontal"
                                                dataSource={data}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            avatar={<Checkbox onChange={onChange}></Checkbox>}
                                                            title={<a href="https://ant.design">{item.title}</a>}
                                                            description={<div className="f-12"><span className="grp-type-icon vedio-play"></span> {item.description}</div>}
                                                        />
                                                    </List.Item>
                                                )}
                                            />,
                                    </Panel>
                                    <Panel header="Section 4: Welcome, Welcome, Welcome!" key="4" className="pb-0 course-content">
                                    <List className=""
                                                itemLayout="horizontal"
                                                dataSource={data}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            avatar={<Checkbox onChange={onChange}></Checkbox>}
                                                            title={<a href="https://ant.design">{item.title}</a>}
                                                            description={<div className="f-12"><span className="grp-type-icon vedio-play"></span> {item.description}</div>}
                                                        />
                                                    </List.Item>
                                                )}
                                            />,
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