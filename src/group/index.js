import { Card, Col, Row } from 'antd';
import React, { Component } from 'react';
import Ads from '../components/ads';
import Courses from '../components/ProfileComponents/courses';
import GroupsPage from '../shared/components/GroupsPage';

class Aboutus extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={16} lg={17} xl={17}>
                        <div className="custom-card">
                            <Card title="Groups" bordered={false}>
                                <GroupsPage />
                            </Card>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={7} xl={7}>
                        <Courses />
                        <Ads />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Aboutus;