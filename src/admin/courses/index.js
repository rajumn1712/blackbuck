import React, { Component, useState } from 'react';
import { Card, Input, Row, Col, Button, Select, Collapse, Space, Steps, message, Upload, Table, Statistic, Tabs, DatePicker, Modal, InputNumber } from 'antd';
import { Link } from "react-router-dom";
import Title from 'antd/lib/typography/Title';
import '../../styles/theme.css';
import { ArrowUpOutlined, ArrowDownOutlined, PlusOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const fileList = [
    {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }
]
const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

const columns = [
    {
        title: 'File Name',
        dataIndex: 'name',
        key: 'name',
        width: 200
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 50
    },
    {
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
        width: 50
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <a className="semibold" style={{ color: 'var(--red)' }}>Delete</a>
            </Space>
        ),
        width: 50
    },
];

const data = [
    {
        key: '1',
        name: 'Introduction.mp4',
        type: 'Video',
        size: '50KB',
    },
    {
        key: '2',
        name: 'Learn how to code from scratch.mp4',
        type: 'Video',
        size: '25KB',
    }
];

const topicTitle = (
    <span className="left-menu play mr-4"></span>
)
const videoDur = () => (
    <div className="f-16 m-0 text-secondary video-dur">12m 35s</div>
  );

const AdminCourses = () => {
    const [current, setCurrent] = React.useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    return (<>
        <Row gutter={12} className="mb-12">
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Members"
                        value={600}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Posts"
                        value={254}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Courses"
                        value={21}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Groups"
                        value={50}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Shares"
                        value={45}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Interships"
                        value={14}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
        </Row>
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div className="custom-card mb-16">
                    <Card className="start-course">
                        <Row align="middle" className="p-16">
                            <Col xs={18} sm={18} md={18} lg={18} xl={18} xxl={18} className="pr-16">
                                <Title level={3} className="normalbold text-white">Get Started with the course</Title>
                                <p className="f-14 text-white mb-0">Whether you've been teaching for years or are teaching for the first time, you can make an engaging course. We've compiled resources and best practices to help you get to the next level, no matter where you're starting.</p>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} className="text-right">
                                <Button type="dashed">Create Course</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <Row>
                    <Col offset={4} xs={16} sm={16} md={16} lg={16} xl={16} xxl={16} className="course-steps">
                        <div className="text-center my-16 pb-16">
                            <Title level={1} className="normalbold text-primary">Get Started with the course</Title>
                            <p className="f-14 text-secondary">Whether you've been teaching for years or are teaching for the first time, you can make an engaging course. We've compiled resources and best practices to help you get to the next level, no matter where you're starting.</p>
                        </div>
                        <Row>
                            <Col offset={1} xs={20} sm={22} md={22} lg={22} xl={22} xxl={22}>
                                <div className="create-course">
                                    <div className="custom-fields">
                                        <label className="text-secondary d-block mb-4">Course Title</label>
                                        <Input placeholder="e.g. Learn how to code from scratch" />
                                    </div>
                                    <div className="custom-fields">
                                        <label className="text-secondary d-block mb-4">Course Description</label>
                                        <TextArea onResize 
                                        autoSize={{ minRows: 3, maxRows: 30 }}
                                        />
                                    </div>
                                    <Row gutter={16}>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="custom-fields">
                                            <label className="text-secondary d-block mb-4">Choose Category</label>
                                            <Select defaultValue="Choose a Category" allowClear placeholder="Choose a Category" className="text-left">
                                                <Option value="Chemistry">Chemistry</Option>
                                                <Option value="Mat Lab">Mat Lab</Option>
                                                <Option value="Accounting Finance">Accounting Finance</Option>
                                                <Option value="Artificial Intelligence">Artificial Intelligence</Option>
                                            </Select>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="custom-fields">
                                            <label className="text-secondary d-block mb-4">Author Name</label>
                                            <Select defaultValue="Choose Author" allowClear placeholder="Choose Author" className="text-left">
                                                <Option value="John Doe">John Doe</Option>
                                                <Option value="Sherlyn">Sherlyn</Option>
                                                <Option value="William Smith">William Smith</Option>
                                                <Option value="Jonas">Jonas</Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="create-course mt-16">
                                    <div className="f-18 add-course-section mb-16 p-12 text-center semibold cursor-pointer text-white">Add Course Section</div>
                                    <div className="lecture-collapse mb-16">
                                        <Collapse
                                            className="mb-16"
                                            expandIconPosition="right"
                                        >
                                            <Panel header="1. Introduction" className="f-16 semibold text-primary" extra={<div className="f-16 text-secondary video-dur">12m 35s</div>}>
                                                <Collapse
                                                    className="mb-8"
                                                    expandIconPosition="right"
                                                >
                                                    <Panel header={<>{topicTitle} Introduction</>} className="f-16 semibold text-primary" extra={<div className="f-16 text-secondary subvideo-dur">6m 15s</div>}>
                                                        <div className="d-flex">
                                                            <video width="280"><source src="/static/media/video.7286ccfa.mp4" /></video>
                                                            <div className="ml-16">
                                                                <p className="f-16 text-primary mb-4">Introduction.mp4</p>
                                                                <p className="f-14 text-secondary mb-8">Introduction to Web Development is a one-stop course that covers all of the tools you’ll need to create websites. The course contains in-depth discussions of each of “The Big Three” tools used for Website development</p>
                                                                <p className="f-12 text-primary">6m 15s | 40MB</p>
                                                                <Button size="small" className="px-16">Edit Content</Button>
                                                            </div>
                                                        </div>
                                                    </Panel>
                                                </Collapse>
                                                <Collapse
                                                    className="mb-8"
                                                    expandIconPosition="right"
                                                >
                                                    <Panel header={<>{topicTitle} What is Angular</>} className="f-16 semibold text-primary" extra={<div className="f-16 text-secondary subvideo-dur">3m 5s</div>}>
                                                        <div className="d-flex">
                                                            <video width="280"><source src="/static/media/video.7286ccfa.mp4" /></video>
                                                            <div className="ml-16">
                                                                <p className="f-16 text-primary mb-4">What is Angular.mp4</p>
                                                                <p className="f-14 text-secondary mb-8">Introduction to Web Development is a one-stop course that covers all of the tools you’ll need to create websites. The course contains in-depth discussions of each of “The Big Three” tools used for Website development</p>
                                                                <p className="f-12 text-primary">3m 5s | 22MB</p>
                                                                <Button size="small" className="px-16">Edit Content</Button>
                                                            </div>
                                                        </div>
                                                    </Panel>
                                                </Collapse>
                                                <Collapse
                                                    className="mb-8"
                                                    expandIconPosition="right"
                                                >
                                                    <Panel header={<>{topicTitle} Versions of Angular</>} className="f-16 semibold text-primary" extra={<div className="f-16 text-secondary subvideo-dur">3m 10s</div>}>
                                                        <div className="d-flex">
                                                            <video width="280"><source src="/static/media/video.7286ccfa.mp4" /></video>
                                                            <div className="ml-16">
                                                                <p className="f-16 text-primary mb-4">Versions of Angular.mp4</p>
                                                                <p className="f-14 text-secondary mb-8">Introduction to Web Development is a one-stop course that covers all of the tools you’ll need to create websites. The course contains in-depth discussions of each of “The Big Three” tools used for Website development</p>
                                                                <p className="f-12 text-primary">3m 10s | 22MB</p>
                                                                <Button size="small" className="px-16">Edit Content</Button>
                                                            </div>
                                                        </div>
                                                    </Panel>
                                                </Collapse>
                                                <div onClick={showModal} className="f-18 add-course-section mt-12 p-12 text-center semibold cursor-pointer text-white">Add Another Topic</div>
                                            </Panel>
                                        </Collapse>
                                        <div className="add-lecture p-4"><span className="icons add"></span></div>
                                    </div>
                                    <div className="lecture-collapse mb-16">
                                        <div className="custom-fields entr-course-title p-12 mb-12">
                                            <Input placeholder="Add section title here" className="f-16 mb-16" />
                                            <div className="text-right">
                                                <Button type="primary" className="addContent px-16" size="small" style={{ marginRight: 8 }}>Add Section</Button>
                                                <Button type="default" className="addContent px-16" size="small">Cancel</Button>
                                            </div>
                                        </div>
                                        <div className="add-lecture p-4"><span className="icons close"></span></div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Modal title="Add Topic" visible={isModalVisible} onCancel={handleCancel} centered
                    footer={<>
                        <Button type="primary">Save</Button>
                    </>}
                    className="addTopicPop"
                >
                    <div className="custom-fields">
                        <label className="text-secondary d-block mb-4">Topic Title</label>
                        <Input />
                    </div>
                    <div className="custom-fields">
                        <label className="text-secondary d-block mb-4">Topic Description</label>
                        <TextArea onResize
                            autoSize={{ minRows: 3, maxRows: 20 }}
                        />
                    </div>
                    <div className="mb-8">
                        <label className="text-secondary d-block mb-4">Feature Image</label>
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            //onPreview={this.handlePreview}
                            //onChange={this.handleChange}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                    </div>
                    <div className="custom-fields">
                        <label className="text-secondary d-block mb-4">Video Source</label>
                        <Select defaultValue="Choose Video Source" allowClear placeholder="Choose Video Source">
                            <Option value="Upload">Upload</Option>
                            <Option value="YouTube">YouTube</Option>
                            <Option value="Vimeo">Vimeo</Option>
                        </Select>
                    </div>
                    <Dragger {...props} className="mb-16">
                        <p className="ant-upload-drag-icon">
                            <span className="sharebox-icons video-upload"></span>
                        </p>
                        <p className="ant-upload-text f-18, semibold">Click or drag file to this area to upload</p>
                    </Dragger>
                    <div className="custom-fields">
                        <Input placeholder="YouTube URL" />
                    </div>
                    <div className="custom-fields">
                        <Input placeholder="Vimeo URL" />
                    </div>
                    <div className="custom-fields">
                        <label className="text-secondary d-block mb-4">Video Playback Time</label>
                        <Input.Group compact>
                            <div className="videoplybacktime">
                                <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                                <em className="text-secondary d-block f-12 mt-4">HH</em>
                            </div>
                            <div className="videoplybacktime">
                                <InputNumber min={1} max={10} defaultValue={5} onChange={onChange} />
                                <em className="text-secondary d-block f-12 mt-4">MM</em>
                            </div>
                            <div className="videoplybacktime">
                                <InputNumber min={1} max={10} defaultValue={0} onChange={onChange} />
                                <em className="text-secondary d-block f-12 mt-4">SS</em>
                            </div>
                        </Input.Group>
                    </div>
                </Modal>

                <Title className="f-18 text-primary semibold">Courses</Title>
                <div className="custom-card">
                    <Card className="p-12 custom-fields">
                        <Row gutter={16} align="middle">
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <Input placeholder="Course Name" />
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <Select allowClear placeholder="Choose Group">
                                    <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                                    <Option value="Chemical Engineering">Chemical Engineering</Option>
                                    <Option value="Information Technology">Information Technology</Option>
                                    <Option value="Civil Engineering">Civil Engineering</Option>
                                    <Option value="Aeronautical Engineering">Aeronautical Engineering</Option>
                                    <Option value="Artificial Intelligence">Artificial Intelligence</Option>
                                </Select>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <RangePicker placeholder={['From Date', 'To Date']} />
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <Button type="primary">Search</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className="custom-card">
                    <Card>
                        <div className="p-12">
                            <Table columns={courseColumns} dataSource={courseData} size="small" pagination={{ position: ["bottomCenter"] }} bordered={true} />
                        </div>
                    </Card>
                </div>
            </Col>
        </Row>
    </>)

}
const courseColumns = [
    {
        title: 'Course Name',
        dataIndex: 'name',
        filters: [
            {
                text: 'Artificial Intelligence',
                value: 'Artificial Intelligence',
            },
            {
                text: 'Cyber Security',
                value: 'Cyber Security',
            },
        ],
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
        render: text => <a>{text}</a>
    },
    {
        title: 'Posts',
        dataIndex: 'posts',
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        render: () => <a style={{ color: 'var(--red)' }}>Delete</a>,
    },
];

const courseData = [
    {
        key: '1',
        name: 'AFM',
        posts: 5,
        date: '12-12-2020 06:30 pm',
    },
    {
        key: '2',
        name: 'Computer Science',
        posts: 10,
        date: '10-11-2020 09:00 am',
    },
    {
        key: '3',
        name: 'Mathematics',
        posts: 32,
        date: '10-11-2020 12:37 pm',
    },
    {
        key: '4',
        name: 'Cyber Security',
        posts: 15,
        date: '08-10-2020 01:53 pm',
    },
];
function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
}
export default AdminCourses;