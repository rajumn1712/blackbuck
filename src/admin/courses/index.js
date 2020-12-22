import React, { Component } from 'react';
import { Card, Input, Row, Col, Button, Select, Collapse, Space, Steps, message, Upload, Table, Tag, Form, Tabs } from 'antd';
import { Link } from "react-router-dom";
import { ErrorMessage, Field, Formik } from "formik";
import CreateCourse from './CreateCourse';
import Title from 'antd/lib/typography/Title';
import '../../styles/theme.css';
import createCourse from "../../styles/images/create-course.svg";

const { Panel } = Collapse;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;
const { TabPane } = Tabs;

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
          <a className="semibold" style={{color: 'var(--red)'}}>Delete</a>
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

const genExtra = () => (
    <>
        <Button type="default" className="addContent" size="small" onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
        }}>
            Add Content
        </Button>
    </>
);
const { Step } = Steps;

const steps = [
    {
        title: ' of 4',
        content: <>
                <Row className="course-step text-center">
                    <Col offset={3} xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
                        <Title className="lmspostTitle">How about a course title</Title>
                        <p className="f-16 text-secondary">It's ok if you can't think of a good title now. You can change it later.</p>
                        <div className="custom-fields lmstitleinput">
                            <Input placeholder="e.g. Learn how to code from scratch" />
                        </div>
                    </Col>
                </Row>
        </>,
    },
    {
        title: ' of 4',
        content: <>
            <Row className="course-step text-center">
                <Col offset={3} xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
                    <Title className="lmspostTitle">What Category best fits the knowledge you'll share?</Title>
                    <p className="f-16 text-secondary">If you're not sure about the right category, you can change it later.</p>
                    <div className="custom-fields lmstitleinput">
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
        </>,
    },
    {
        title: ' of 4',
        content: <>
            <Row className="course-step">
                <Col offset={3} xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
                    <Title className="lmspostTitle text-center">Learn how to code from scratch</Title>
                    <div className="create-course">
                        <div className="lecture-collapse">
                            <Collapse
                                expandIconPosition="right"
                            >
                                <Panel header="Lecture 1" className="f-18 semibold text-primary" extra={genExtra()}>
                                    <div className="f-14 text-secondary normalbold">
                                        <div className="custom-fields mb-0">
                                            <label className="text-secondary d-block mb-4">Enter Lecture Description</label>
                                            <TextArea autoSize />
                                        </div>
                                        <Tabs defaultActiveKey="1">
                                            <TabPane tab="Upload Video" key="1">
                                                <div>
                                                    <Dragger {...props}>
                                                        <p className="ant-upload-drag-icon">
                                                            <span className="sharebox-icons video-upload"></span>
                                                        </p>
                                                        <p className="ant-upload-text f-18, semibold">Click or drag file to this area to upload</p>
                                                    </Dragger>
                                                </div>
                                                <Table columns={columns} dataSource={data} size="small" className="mt-16" pagination={{ position: ["bottomCenter"] }} />
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
                                                <Table columns={columns} dataSource={data} size="small" className="mt-16" pagination={{ position: ["bottomCenter"] }} />
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                        <div className="lecture-collapse">
                            <Collapse
                                expandIconPosition="right"
                            >
                                <Panel header="Lecture 2" className="f-18 semibold text-primary" extra={genExtra()}>
                                    <div className="f-14 text-secondary normalbold"></div>
                                </Panel>
                            </Collapse>
                            <div className="add-lecture p-4"><span className="icons add"></span></div>
                        </div>
                        <div className="lecture-collapse">
                        <div className="custom-fields entr-course-title">
                            <Input placeholder="Enter Lecture Title" className="f-16 mb-16" />
                            <div className="text-right">
                            <Button type="default" className="addContent" size="small">Cancel</Button>
                            <Button type="primary" className="addContent" size="small" style={{marginLeft: 8}}>Add Lecture</Button>
                            </div>
                        </div>
                        <div className="add-lecture p-4"><span className="icons close"></span></div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    },
    {
        title: ' of 4',
        content: <>
            <Row className="course-step">
                <Col offset={3} xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
                    <div className="custom-fields">
                        <label className="text-secondary d-block mb-4">Lecture Description</label>
                        <TextArea onResize />
                    </div>
                    <div className="custom-fields d-block mb-4">
                        <label className="text-secondary">Author Name</label>
                        <Input />
                    </div>
                    <div className="custom-fields d-block mb-4">
                        <label className="text-secondary">Designation</label>
                        <Input />
                    </div>
                </Col>
            </Row>
        </>
    }
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
        <Row>
            <Col xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
                <div className="custom-card">
                    <Card>
                        <Row align="middle">
                            <Col xs={10} sm={10} md={10} lg={10} xl={10} xxl={10}>
                                <img src={createCourse} width="100%" className="p-16" />
                            </Col>
                            <Col xs={14} sm={14} md={14} lg={14} xl={14} xxl={14} className="pr-16">
                                <Title level={3} className="normalbold text-secondary">Get Started with the course</Title>
                                <p className="f-16 text-secondary">Whether you've been teaching for years or are teaching for the first time, you can make an engaging course. We've compiled resources and best practices to help you get to the next level, no matter where you're starting.</p>
                                <Button type="primary" className="mt-8">Create Course</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className="custom-card">
                    <Card>
                        <div className="p-16">
                            <Steps current={current}>
                                {steps.map(item => (
                                    <Step key={item.title} title={item.title} />
                                ))}
                            </Steps>
                            <div className="steps-content">{steps[current].content}</div>
                            <div className="steps-action" style={{paddingBottom: 30}}>
                                <Row>
                                    <Col offset={3} xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
                                        <div className="d-flex justify-between">
                                            {current > 0 && (
                                                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                                    Previous
                                    </Button>
                                            )}
                                            {current === steps.length - 1 && (
                                                <Button style={{ margin: '0 8px' }} type="primary" onClick={() => message.success('Processing complete!')}>
                                                    Publish
                                    </Button>
                                            )}
                                            {current < steps.length - 1 && (
                                                <Button style={{ margin: '0 8px 0 auto' }} type="primary" onClick={() => next()}>
                                                    Next
                                    </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="custom-card">
                    <Card>
                        <div className="p-12">
                            <Table columns={courseColumns} dataSource={courseData} pagination={{ position: ["bottomCenter"] }} />
                        </div>
                    </Card>
                </div>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>

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
        render: () => <a style={{color: 'var(--red)'}}>Delete</a>,
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