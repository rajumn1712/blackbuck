import React, { Component } from 'react';
import { Card, List, Form, Row, Col, Select, Input, message } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store';
import '../../index.css';
import '../../App.css';
import Dragger from 'antd/lib/upload/Dragger';
import CommonModal from './CommonModal';
import { saveInnternship } from '../../shared/api/apiServer';
import Loader from '../../common/loader';

const docs = [
    {
        avatar: [<span className="icon education-icon mr-0"></span>],
        title: 'Inter Marks memo.jpeg'
    }
]
const { Option } = Select;
const internshipsObj = {
    CompanyName: '',
    ShortName: '',
    Place: '',
    Duration: '',
    lstUploadLogos: [],
    lstUploadFiles: []
}
class Intership extends Component {
    state = {
        internships: this.props.internships,
        internshipsObj: internshipsObj,
        visible: false,
        fileUploading: false,
        fileUpload: false
    };
    uploadProps = {
        name: 'file',
        multiple: false,
        action: 'http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile',
        onChange: (info) => {
            this.setState({ ...this.state, fileUploading: true });
            const { status } = info.file;
            if (status !== 'uploading') {
                this.setState({ ...this.state, fileUploading: false })
            }
            if (status === 'done') {
                const { internshipsObj } = this.state;
                internshipsObj.lstUploadLogos = [info.file.response]
                this.setState({ internshipsObj: internshipsObj })
                message.success(`${info.file.name} file uploaded successfully.`);
                this.setState({ ...this.state, fileUploading: false })
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                this.setState({ ...this.state, fileUploading: false })
            }
        },
    };
    uploadfileProps = {
        name: 'file',
        multiple: false,
        action: 'http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile',
        onChange: (info) => {
            this.setState({ ...this.state, fileUpload: true });
            const { status } = info.file;
            if (status !== 'uploading') {
                this.setState({ ...this.state, fileUpload: false })
            }
            if (status === 'done') {
                const { internshipsObj } = this.state;
                internshipsObj.lstUploadFiles = [info.file.response]
                this.setState({ internshipsObj: internshipsObj })
                message.success(`${info.file.name} file uploaded successfully.`);
                this.setState({ ...this.state, fileUpload: false })
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                this.setState({ ...this.state, fileUpload: false })
            }
        },
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleChange = (target) => {
        const { internshipsObj } = this.state;
        internshipsObj[target.currentTarget.name] = target.currentTarget ? target.currentTarget.value : target;
        this.setState({ internshipsObj: internshipsObj })
    }
    handleddlChange = (value) => {
        const { internshipsObj } = this.state;
        internshipsObj.Duration = value;
        this.setState({ internshipsObj: internshipsObj })
    }
    handleOk = e => {
        saveInnternship(this.props?.profile?.Id, this.state.internshipsObj).then(res => {
            message.success('Intership saved successfully')
        })
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
        const { internshipsObj } = this.state;
        return (
            <div className="custom-card">
                <Card title="Internships" bordered={false} extra={!this.props.IsHideAction ? <Link onClick={this.showModal}><span className="icons add" /></Link> : null}  >
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
                        <Row gutter={16} className="mb-16">
                            <Col xs={12}>
                                <Form.Item label="Company Name" className="custom-fields">
                                    <Input name="CompanyName" value={internshipsObj.CompanyName} onChange={(event) => this.handleChange(event)} />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Short Name" className="custom-fields">
                                    <Input name="ShortName" value={internshipsObj.ShortName} onChange={(event) => this.handleChange(event)} />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Place" className="custom-fields">
                                    <Input name="Place" value={internshipsObj.Place} onChange={(event) => this.handleChange(event)} />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item label="Duration" className="custom-fields">
                                    <Select name="Duration" defaultValue="Select Option" value={internshipsObj.Duration} onChange={(event) => this.handleddlChange(event)}>
                                        <Option value="Select Option">Select Duration</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={12}>
                                <Dragger className="upload" {...this.uploadProps} onRemove={() => this.setState({ ...this.state.internshipsObj, lstUploadLogos: [] })}>
                                    {this.state.fileUploading && <Loader className="loader-top-middle" />}
                                    <span className="sharebox-icons photo-upload"></span>
                                    <p className="ant-upload-text mt-8 mb-0">Upload Logo</p>
                                </Dragger>
                            </Col>
                            <Col xs={12}>
                                <Dragger className="upload" {...this.uploadfileProps} onRemove={() => this.setState({ ...this.state.internshipsObj, lstUploadFiles: [] })}>
                                    {this.state.fileUpload && <Loader className="loader-top-middle" />}
                                    <span className="sharebox-icons photo-upload"></span>
                                    <p className="ant-upload-text mt-8 mb-0">Upload certificate</p>
                                </Dragger>
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
                </CommonModal>
            </div>

        )
    }
}
export default Intership;