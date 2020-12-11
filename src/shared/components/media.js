import React, { Component } from 'react';
import { Button, Card, Divider, Row, Col, Form, Input, Select, List, Avatar,Tabs } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store'
import '../../index.css';
import '../../App.css';
import TextArea from 'antd/lib/input/TextArea';
import user from '../../styles/images/user.jpg';
const { Option } = Select;
const joingroup = <div className="join-grp-title">John Doe <span className="join-grp-txt">has Created a group name is</span> Mech Mantra</div>
const { TabPane } = Tabs;
class Media extends Component {

    render() {
        return (
            <div className="custom-card">
                <Card title="Media" bordered={false}>
                <Tabs defaultActiveKey="1" className="profile-tabs">
                            <TabPane tab="Photos" key="3">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                       
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                       
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Videos" key="1">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                       
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                       
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Albums" key="2">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                     
                                    </Col>
                                </Row>
                            </TabPane>

                        </Tabs>
                </Card>
                
            </div>
        )
    }
}
export default Media;