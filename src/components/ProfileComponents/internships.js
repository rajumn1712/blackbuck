import React, { Component } from 'react';
import { Card, List, Form, Row, Col, Select, Input } from 'antd'
import { Link } from 'react-router-dom';
// import { userManager } from '../shared/authentication/auth';
import { store } from '../../store'
// import User1 from '../styles/images/avatar.png';
// import User2 from '../styles/images/user.jpg';
// import User3 from '../styles/images/user_image.jpg';
// import User4 from '../styles/images/user-image.jpg';
import wipro from '../../styles/images/Wiprologo.svg'
import infosys from '../../styles/images/infosys.svg'

// import { userLogout } from '../reducers/auth';
import '../../index.css';
import '../../App.css';
// import TextArea from 'antd/lib/input/TextArea';
// import Modal from 'antd/lib/modal/Modal';
import Dragger from 'antd/lib/upload/Dragger';
import CommonModal from './CommonModal';

const { Option } = Select;

class Intership extends Component {
    state = { 
        internships:this.props.internships,
        visible: false 
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    render() {
        const { user } = store.getState().oidc;
        const data = [...this.state.internships];
        return (
            <div className="custom-card">
                <Card title="Internships" bordered={false} extra={<Link onClick={this.showModal}><span className="icons add" /></Link>}  >
                    <List
                        grid={{
                            gutter: 8,
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 2,
                            xl: 2,
                            xxl: 2,
                        }}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <div className="intern-cards">
                                    <span className="left-menu intenship card-options-left" />
                                    <span className="icons more card-options-right" />
                                    <div className="intern-cardbody">
                                        <img src={item.CompanyLogo} />
                                        <h4 className="title">{item.CompanyName}</h4>
                                        <p className="description"><span className="afterline mr-16">{item.Location}</span><span className="">{item.Duration}</span></p>
                                    </div>
                                    <div className="intern-cardfooter">
                        <p className="mb-0"><span className="icons pdf mr-8" />{item.Certificate}</p>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
                <CommonModal visible={this.state.visible} title="Internships" cancel={this.handleCancel} saved={this.handleOk}>
                <Form
                        layout="vertical"
                    >
                        <Row gutter={16}>
                            <Col xs={12}>
                                <Form.Item label="Company Name" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Short Name" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Place" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Duration" className="custom-fields">
                                    <Select defaultValue="Select Option">
                                        <Option value="Select Option">Select Duration</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={12}>
                                <Dragger className="upload" >
                                    <span className="sharebox-icons photo-upload"></span>
                                    <p className="ant-upload-text mt-8 mb-0">Upload Logo</p>
                                </Dragger>
                            </Col>
                            <Col xs={12}>
                                <Dragger className="upload" >
                                    <span className="sharebox-icons photo-upload"></span>
                                    <p className="ant-upload-text mt-8 mb-0">Upload certificate</p>
                                </Dragger>
                            </Col>
                            <Col xs={12}>

                            </Col>
                        </Row>
                    </Form>
                </CommonModal>
            </div>

        )
    }
}
export default Intership;