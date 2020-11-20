import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, Divider, Row, Col, Modal, Form, Input, Select } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../../shared/authentication/auth';
import { store } from '../../store'
import User1 from '../../styles/images/avatar.png';
import User2 from '../../styles/images/user.jpg';
import User3 from '../../styles/images/user_image.jpg';
import User4 from '../../styles/images/user-image.jpg';
import { userLogout } from '../../reducers/auth';
import '../../index.css';
import '../../App.css';
import TextArea from 'antd/lib/input/TextArea';
import CommonModal from './CommonModal';
const { Option } = Select;
const data = [

    {
        avatar: User1,
        title: 'IT Groups',
        description: '',
        members: 161,
    },
    {
        avatar: User2,
        title: 'CSC Champs',
        description: '',
        members: 18,
    },

    {
        avatar: User3,
        title: 'Civili',
        description: 'created many changes with CBU...',
        members: 21,
    },
    {
        avatar: User4,
        title: 'Technical Group',
        description: '',
        members: 3,
    },
];
class About extends Component {
    state = {
        phone: this.props.about.PhoneNumber,
        email: this.props.about.Email,
        description: this.props.about.Aboutme,
        address: this.props.about.Address,
        visible: false
    };
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
    };
    render() {
        const { user } = store.getState().oidc;

        const { phone, email, description, address, visible } = this.state;

        return (
            <div className="custom-card">
                <Card title="About Me" bordered={false} extra={<Link onClick={this.showModal}><span className="icons edit" /></Link>} actions={[
                    <Button type="primary" >Download Profile as PDF</Button>
                ]} >
                    <div>
                        <p>{description}</p>
                        <Divider className="text-left-line" orientation="left">Contact</Divider>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <div className="about-details">
                                    <div className="about-icons">
                                        <span className="icons location" />
                                    </div>
                                    {address.map((address,index)=>{
                                        return <p key={index}>
                                            {Object.keys(address).map((k)=>{return address[k]}).join(",")}
                                        </p>
                                    })}
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="about-details">
                                    <div className="about-icons">
                                        <span className="icons phone" />
                                    </div>
                                    <p>{phone}</p>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="about-details">
                                    <div className="about-icons">
                                        <span className="icons email" />
                                    </div>
                                    <p>{email}</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>
                <CommonModal visible={visible} title="About Me" cancel={this.handleCancel} saved={this.handleOk}>
                    <Form
                        layout="vertical"
                    >
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item label="About Me" className="custom-fields">
                                    <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <h3>Contact</h3>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Plot No" className="custom-fields">
                                    <Input />
                                    <span style={{ color: 'red', textAlign: 'right' }}>is required</span>
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Street Name" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Address Line 1" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Address Line 2" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="State" className="custom-fields">
                                    <Select defaultValue="Select Option">
                                        <Option value="Select Option">Select State</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Country" className="custom-fields">
                                    <Select defaultValue="India">
                                        <Option value="Select Option">Select Option</Option>
                                        <Option value="India">India</Option>
                                        <Option value="Singapore">Singapore</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Pin Code" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Phone Number" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Email" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </CommonModal>
            </div>
        )
    }
}
export default About;