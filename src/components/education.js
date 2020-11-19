import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, Divider, Row, Col, Modal, Form, Input, Select,Tooltip } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import User1 from '../styles/images/avatar.png';
import User2 from '../styles/images/user.jpg';
import User3 from '../styles/images/user_image.jpg';
import User4 from '../styles/images/user-image.jpg';
import { userLogout } from '../reducers/auth';
import '../index.css';
import '../App.css';
import { Meta } from 'antd/lib/list/Item';
import Dragger from 'antd/lib/upload/Dragger';
const { Option } = Select;
const data = [

    {
        avatar: User1,
        title: 'IT Groups',
        description: '',
        members: 161,
    },
];
const docs = [
    {avatar : [<span className="icon education-icon mr-0"></span>],
    title: 'Inter Marks memo.jpeg',
}
    ]
class Education extends Component {
    state = { visible: false };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Education" bordered={false} extra={<Link onClick={this.showModal}><span className="icons add" /></Link>} >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <div className="edu-card">
                                <Meta
                                    className="edu-study"
                                    avatar={<div className="about-icons">
                                        <span className="icons location" />
                                    </div>}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">St.Ann's intermediate junior college</span></div>}
                                    description={<div><span style={{ color: 'var(--textprimary)' }}></span> 2010 - 2012 | <span style={{ color: 'var(--textprimary)' }}></span>Hyderabad</div>}
                                />
                                <Meta
                                    className="edu-certificate"
                                    avatar={<div className="about-icons">
                                        <span className="icons location" />
                                    </div>}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">Inter Marks memo.jpeg</span></div>}
                                />
                                <Link to="" className="f-12 list-link"><span className="icons edit" /></Link>
                            </div>
                        )}
                    />
                </Card>
                <Modal
                    title={<div className="custom-modal-header"><h4>Education</h4><a onClick={this.handleCancel}><span className="close-icon" /></a></div>}
                    visible={this.state.visible}
                    closable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<div className="d-flex justify-content-between">
                        <Button key="back" onClick={this.handleCancel} className="btn-cancel">
                            Close
                                    </Button>
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            Save
                                    </Button></div>
                    ]}>
                    <div className="">
                        <Divider className="text-left-line" orientation="left">School</Divider>
                        <Row gutter={16}>
                            <Col xs={12}>
                                <Form.Item label="Education Type" className="custom-fields">
                                    <Select defaultValue="Select Option">
                                        <Option value="Select Option">Select State</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="College/University Name" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Academic Year" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Place of College/University" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Marks Grade" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        
                        <div className="docs about-icons mb-16 education">
                            <List
                                itemLayout="horizontal"
                                dataSource={docs}
                                renderItem={item => (
                                    <List.Item className="upload-preview">
                                        <List.Item.Meta
                                            avatar={item.avatar}
                                            title={item.title}
                                            description={<div className="file-size f-14">{item.fileSize}</div>}
                                        />
                                        <span className="close-icon"></span>
                                    </List.Item>
                                )}
                            />
                        </div>

                        <Divider className="text-left-line" orientation="left">college</Divider>
                        <Row gutter={16}>
                        <Col xs={12}>
                            <Form.Item label="Education Type" className="custom-fields">
                                <Select defaultValue="Select Option">
                                    <Option value="Select Option">Select State</Option>
                                </Select>
                            </Form.Item>
                            </Col>
                        <Col xs={12}>
                            <Form.Item label="College/University Name" className="custom-fields">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item label="Academic Year" className="custom-fields">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item label="Place of College/University" className="custom-fields">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item label="Marks Grade" className="custom-fields">
                                <Input />
                            </Form.Item>
                        </Col>
                        </Row>
                        <Dragger className="upload" >
                            <span className="sharebox-icons photo-upload"></span>
                            <p className="ant-upload-text mt-8 mb-0">Upload Certificate</p>
                        </Dragger>
                        <Divider className="text-left-line" orientation="left">Add Education</Divider>
                    </div>

                </Modal>
            </div >

        )
    }
}
export default Education;