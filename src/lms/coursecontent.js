import React, { Component } from 'react';
import { Card, List,Row,Col } from 'antd'
import { Link } from 'react-router-dom';
import '../index.css';
import '../App.css';

class CourseContent extends Component {
    render() {
        return (
            <div className="post-preview-box post-card comment-show">
                <Row gutter={24}>
                    <Col xs={24} sm={16} md={16} lg={17} >
                        sdfg
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={7}>
                        dfghj
                    </Col>
                </Row>
            </div>
        )
    }
}
export default CourseContent;