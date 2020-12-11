import React, { Component } from 'react';
import { Button, Card, Divider, Row, Col, Form, Input, Select, List, Avatar, Tabs } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store'
import '../../index.css';
import '../../App.css';
import TextArea from 'antd/lib/input/TextArea';
import user from '../../styles/images/user.jpg';
const { Option } = Select;
const joingroup = <div className="join-grp-title">John Doe <span className="join-grp-txt">has Created a group name is</span> Mech Mantra</div>
const { TabPane } = Tabs;
const { Meta } = Card;
class Media extends Component {

    render() {
        return (
            <div className="custom-card">
                <Card title="Media" bordered={false} extra={<div><a className="f-14 px-16" href="#">Create Album</a><a className="pl-8 f-14" href="#">Add Photos/Video</a></div>}>
                    <Tabs defaultActiveKey="1" className="profile-tabs">
                        <TabPane tab="Photos" key="1">
                            <Row gutter={16}>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8} className="m-8">
                                    <Card
                                        hoverable
                                        cover={<img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                                    >
                                    </Card>
                                </Col>

                            </Row>
                        </TabPane>
                        <TabPane tab="Videos" key="2">
                            <Row gutter={16}>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8} className="m-8">
                                    <Card
                                        hoverable
                                        cover={<img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                                    >
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="Albums" key="3">
                            <Row gutter={16}>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8} className="m-8">
                                    <Card
                                        hoverable
                                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                                    >
                                        <Meta title="June 30, 2020" description="3 photos" />
                                    </Card>
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