import { Col, Row } from "antd";
import React, { Component } from "react";
import Ads from "../components/ads";
import CourseCards from "./coursecards";
import Courses from './courses'
import Invite from '../shared/components/Invite'

class LMSComponent extends Component {
    render() {
        return (
            <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={16} lg={17} xl={17}>
                        <Courses />
                        <CourseCards />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={7} xl={7}>
                        <Invite />
                        <Ads />
                    </Col>
                </Row>
            </div>
        );
    }
}
export default LMSComponent;