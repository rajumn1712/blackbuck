import React, { Component } from 'react';
import { Card, Input, Row, Col, Button, Select, Collapse, Space, Steps, message, Upload, Table, Statistic, Tabs, DatePicker } from 'antd';
import { Link } from "react-router-dom";
import Title from 'antd/lib/typography/Title';
import '../../styles/theme.css';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

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

const { Step } = Steps;

const steps = [
    {
        title: 'Content',
        content: <>
            <div className="create-course">
                <div className="custom-fields">
                    <label className="text-secondary d-block mb-4">Course Title</label>
                    <Input placeholder="e.g. Learn how to code from scratch" />
                </div>
                <div className="custom-fields">
                    <label className="text-secondary d-block mb-4">Choose Category</label>
                    <Select defaultValue="Computer Science Engineering" allowClear placeholder="Choose a Category" className="text-left">
                        <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                        <Option value="Chemical Engineering">Chemical Engineering</Option>
                        <Option value="Information Technology">Information Technology</Option>
                        <Option value="Civil Engineering">Civil Engineering</Option>
                        <Option value="Aeronautical Engineering">Aeronautical Engineering</Option>
                        <Option value="Artificial Intelligence">Artificial Intelligence</Option>
                    </Select>
                </div>
                <Row gutter={16}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <div className="custom-fields">
                            <label className="text-secondary d-block mb-4">Select College</label>
                            <Select defaultValue="Computer Science Engineering" allowClear placeholder="Choose a Category" className="text-left">
                                <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                                <Option value="Chemical Engineering">Chemical Engineering</Option>
                                <Option value="Information Technology">Information Technology</Option>
                                <Option value="Civil Engineering">Civil Engineering</Option>
                                <Option value="Aeronautical Engineering">Aeronautical Engineering</Option>
                                <Option value="Artificial Intelligence">Artificial Intelligence</Option>
                            </Select>
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <div className="custom-fields">
                            <label className="text-secondary d-block mb-4">Select Group</label>
                            <Select defaultValue="Computer Science Engineering" allowClear placeholder="Choose a Category" className="text-left">
                                <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                                <Option value="Chemical Engineering">Chemical Engineering</Option>
                                <Option value="Information Technology">Information Technology</Option>
                                <Option value="Civil Engineering">Civil Engineering</Option>
                                <Option value="Aeronautical Engineering">Aeronautical Engineering</Option>
                                <Option value="Artificial Intelligence">Artificial Intelligence</Option>
                            </Select>
                        </div>
                    </Col>
                </Row>
                <div className="custom-fields">
                    <label className="text-secondary d-block mb-4">Course Description</label>
                    <TextArea onResize />
                </div>
                <Row gutter={16}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="custom-fields">
                        <label className="text-secondary">Author Name</label>
                        <Input />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="custom-fields">
                        <label className="text-secondary">Designation</label>
                        <Input />
                    </Col>
                </Row>
            </div>
        </>,
    },
    {
        title: ' Curriculam',
        content: <>
            <div className="create-course">
                <div className="lecture-collapse mb-12">
                    <Collapse
                        expandIconPosition="right"
                    >
                        <Panel header="Lecture 1" className="f-18 semibold text-primary">
                            <div className="f-14 text-secondary normalbold">
                                <div className="custom-fields mb-0">
                                    <label className="text-secondary d-block mb-4">Enter Lecture Description</label>
                                    <TextArea autoSize />
                                </div>
                                <Tabs defaultActiveKey="1" className="custom_tabs" size="middle">
                                    <TabPane tab="Upload Video" key="1">
                                        <div>
                                            <Dragger {...props}>
                                                <p className="ant-upload-drag-icon">
                                                    <span className="sharebox-icons video-upload"></span>
                                                </p>
                                                <p className="ant-upload-text f-18, semibold">Click or drag file to this area to upload</p>
                                            </Dragger>
                                        </div>
                                        <Table columns={columns} dataSource={data} size="small" className="mt-16" pagination={{ position: ["bottomCenter"] }} bordered={true} />
                                    </TabPane>
                                    <TabPane tab="Upload Thumbnail" key="2">
                                        <div>
                                            <Dragger {...props}>
                                                <p className="ant-upload-drag-icon">
                                                    <span className="sharebox-icons photo-upload"></span>
                                                </p>
                                                <p className="ant-upload-text f-18, semibold">Click or drag file to this area to upload</p>
                                            </Dragger>
                                        </div>
                                        <Table columns={columns} dataSource={data} size="small" className="mt-16" pagination={{ position: ["bottomCenter"] }} bordered={true} />
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <div className="lecture-collapse mb-12">
                    <Collapse
                        expandIconPosition="right"
                    >
                        <Panel header="Lecture 2" className="f-18 semibold text-primary">
                            <div className="f-14 text-secondary normalbold"></div>
                        </Panel>
                    </Collapse>
                    <div className="add-lecture p-4"><span className="icons add"></span></div>
                </div>
                <div className="lecture-collapse mb-12">
                    <div className="custom-fields entr-course-title p-12 mb-12">
                        <Input placeholder="Enter Lecture Title" className="f-16 mb-16" />
                        <div className="text-right">
                            <Button type="primary" className="addContent px-16" size="small" style={{ marginRight: 8 }}>Add Lecture</Button>
                            <Button type="default" className="addContent px-16" size="small">Cancel</Button>
                        </div>
                    </div>
                    <div className="add-lecture p-4"><span className="icons close"></span></div>
                </div>
            </div>
        </>
    },
];
const AdminCourses = () => {
    const [current, setCurrent] = React.useState(0);

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
                            <Col offset={4} xs={16} sm={16} md={16} lg={16} xl={16} xxl={16}>
                                <Steps current={current}>
                                    {steps.map(item => (
                                        <Step key={item.title} title={item.title} />
                                    ))}
                                </Steps>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={1} xs={20} sm={22} md={22} lg={22} xl={22} xxl={22}>
                                <div className="custom-card mt-16">
                                    <Card>
                                        <div className="course-step">
                                            <div className="steps-content">
                                                {steps[current].content}
                                            </div>
                                            <div className="steps-action" style={{ marginTop: 30 }}>
                                                <div className="d-flex justify-between">
                                                    {current > 0 && (
                                                        <Button onClick={() => prev()}>
                                                            Previous
                                    </Button>
                                                    )}
                                                    {current === steps.length - 1 && (
                                                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                                            Publish
                                    </Button>
                                                    )}
                                                    {current < steps.length - 1 && (
                                                        <Button style={{ marginLeft: 'auto' }} type="primary" onClick={() => next()}>
                                                            Next
                                    </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
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