import React, { Component } from 'react';
import { Card, Avatar, List, Divider, Row, Col, Form, Input, Select, DatePicker } from 'antd'
import { Link } from 'react-router-dom';
// import { userManager } from '../../shared/authentication/auth';
import { store } from '../../store'
// import User1 from '../styles/images/avatar.png';
// import User2 from '../styles/images/user.jpg';
// import User3 from '../styles/images/user_image.jpg';
// import User4 from '../styles/images/user-image.jpg';
// import { userLogout } from '../../reducers/auth';
import '../../index.css';
import '../../App.css';
import { Meta } from 'antd/lib/list/Item';
import Dragger from 'antd/lib/upload/Dragger';
import CommonModal from './CommonModal';
const { Option } = Select;
const { RangePicker } = DatePicker;
const docs = [
    {
        avatar: [<span className="icon education-icon mr-0"></span>],
        title: 'Inter Marks memo.jpeg'
    }
]
class Education extends Component {
    state = {
        education: this.props.education,
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
    }

    render() {
        const { user } = store.getState().oidc;

        const { education, visible } = this.state
        return (
            <div className="custom-card">
                <Card title="Education" bordered={false} extra={!this.props.IsHideAction ? <Link onClick={this.showModal}><span className="icons add" /></Link> : null} >
                    <List
                        itemLayout="horizontal"
                        dataSource={education}
                        renderItem={item => (
                            <div className="edu-card">
                                <Meta
                                    className="edu-study"
                                    avatar={<div className="about-icons">
                                        <span className="icons location" />
                                    </div>}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.Name}</span></div>}
                                    description={<div><span style={{ color: 'var(--textprimary)' }}></span> {item.StartDate} - {item.EndDate} | <span style={{ color: 'var(--textprimary)' }}></span>{item.Location}</div>}
                                />
                                <Meta
                                    className="edu-certificate"
                                    avatar={<div className="about-icons">
                                        <span className="icon education-icon mr-0" />
                                    </div>}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.File ? item.File : 'No Files'}</span></div>}
                                />
                                {!this.props.IsHideAction ? <Link className="f-12 list-link"><span className="icons edit" /></Link> : null}
                            </div>
                        )}
                    />
                </Card>
                <CommonModal className="custom-popup" visible={this.state.visible} title="Education" cancel={this.handleCancel} saved={this.handleOk}>
                    <div className="">
                        <Divider className="text-left-line" orientation="left">School</Divider>
                        <Form layout="vertical" >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Education Type" className="custom-fields custom-select">
                                        <Select defaultValue="Select Option">
                                            <Option value="Select Option">Select State</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="College/University Name" className="custom-fields">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Academic Year" className="custom-fields">
                                        <Input.Group compact>
                                            <RangePicker />
                                        </Input.Group>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Place of College/University" className="custom-fields">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Marks Grade" className="custom-fields">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>

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

                        <Divider className="text-left-line" orientation="left">College</Divider>
                        <Form layout="vertical" >
                            <Row gutter={16}>
                                <Col xs={12}>
                                    <Form.Item label="Education Type" className="custom-fields custom-select">
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
                                        <Input.Group compact>
                                            <RangePicker />
                                        </Input.Group>
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
                        </Form>
                        <Dragger className="upload mb-24" >
                            <span className="sharebox-icons photo-upload"></span>
                            <p className="ant-upload-text mt-8 mb-0">Upload Certificate</p>
                        </Dragger>
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
                        <Divider className="text-left-line" orientation="left">Add Education</Divider>
                    </div>
                </CommonModal>
            </div >

        )
    }
}
export default Education;