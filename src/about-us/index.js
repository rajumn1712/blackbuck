import { Col, Row } from 'antd';
import React, { Component } from 'react';
import Ads from '../components/ads';
import Courses from '../components/ProfileComponents/courses';
import Friends from '../components/friends';
import Groups from '../shared/components/Groups';
import Identity from '../components/identity';
import Invite from '../components/invite';

class Aboutus extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={16} lg={18} xl={18}>
                        <Friends />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Courses />
                        <Ads />
                        <Groups />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Aboutus;