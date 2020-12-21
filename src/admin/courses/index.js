import React, { Component } from 'react';
import { Card, Input, Row, Col, Button } from 'antd';
import { Link } from "react-router-dom";
import CreateCourse from './CreateCourse';
import Title from 'antd/lib/typography/Title';
import '../../styles/theme.css';

class AdminCourses extends Component {
    render() {
        return <>
            <div className="custom-card">
                <Card
                    title="Courses"
                >
                    <div className="p-16">
                        <a href="/admin/CreateGroup">Create Course</a>
                    </div>
                </Card>
            </div>
            <div className="custom-card">
                <Card
                    title="Step 1 of 4"
                >
                    <div className="course-step text-center">
                        <Title className="lmspostTitle">How about a course title</Title>
                        <p className="f-16 text-secondary">It's ok if you can't think of a good title now. You can change it later.</p>
                        <Row gutter={16}>
                            <Col offset={3} xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
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
        </>
    }
}
export default AdminCourses;