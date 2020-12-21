import React, { Component } from 'react';
import { Card, Input, Row, Col, Button, Select } from 'antd';
import { Link } from "react-router-dom";
import CreateCourse from './CreateCourse';
import Title from 'antd/lib/typography/Title';
import '../../styles/theme.css';
import createCourse from "../../styles/images/create-course.svg";

const { Option } = Select;

class AdminCourses extends Component {
    render() {
        return <>
            <div className="custom-card">
                <Card
                    title="Courses"
                >                    
                    <Row gutter={16} className="p-16">
                        <Col xs={10} sm={10} md={10} lg={10} xl={10} xxl={10}>
                            <img src={createCourse} width="100%" className="p-16" />
                        </Col>
                        <Col xs={14} sm={14} md={14} lg={14} xl={14} xxl={14}>
                            <Title level={3} className="normalbold text-secondary mt-16 pt-16">Get Started with the course</Title>
                            <p className="f-14 text-secondary">Whether you've been teaching for years or are teaching for the first time, you can make an engaging course. We've compiled resources and best practices to help you get to the next level, no matter where you're starting.</p>
                            <Button type="primary">Create Course</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
            <div className="custom-card">
                <Card
                    title="Step 1 of 4"
                >
                    <div className="course-step text-center">
                        <Row gutter={16}>
                            <Col offset={3} xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
                            <Title className="lmspostTitle">How about a course title</Title>
                            <p className="f-16 text-secondary">It's ok if you can't think of a good title now. You can change it later.</p>
                                <div className="custom-fields lmstitleinput">
                                    <Input placeholder="e.g. Learn how to code from scratch" />
                                </div>
                                <div className="mt-16 d-flex justify-between">
                                    <Button>Back</Button>
                                    <Button type="primary">Next</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
            <div className="custom-card">
                <Card
                    title="Step 2 of 4"
                >
                    <Row gutter={16} className="course-step text-center">
                        <Col offset={3} xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
                            <Title className="lmspostTitle">What Category best fits the knowledge you'll share?</Title>
                            <p className="f-16 text-secondary">If you're not sure about the right category, you can change it later.</p>
                            <div className="custom-fields lmstitleinput">
                            <Select defaultValue="lucy" allowClear placeholder="Choose a Category" className="text-left">
                                <Option value="Development">Development</Option>
                                <Option value="Business">Business</Option>
                                <Option value="IT & Software">IT & Software</Option>
                                <Option value="Office Productivity">Office Productivity</Option>
                                <Option value="Marketing">Marketing</Option>
                                <Option value="Photography">Photography</Option>
                            </Select>
                            </div>
                            <div className="mt-16 d-flex justify-between">
                                <Button>Back</Button>
                                <Button type="primary">Next</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </>
    }
}
export default AdminCourses;