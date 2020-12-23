import { Card, Col, Row, Statistic } from "antd";
import React, { Component } from "react";
import photography from '../styles/images/photography.png'

const { Meta } = Card;


class CourseCards extends Component {
    render() {
        return (
            <div className="custom-card">
                <Card
                    title="My Courses"
                    bordered={false}
                >
                    <div className="p-12">
                        <Row>
                            <Col xs={24} md={12} lg={8}>
                                <Card
                                    className="card-item"
                                    cover={<img alt="photography" src={photography} />}
                                >
                                    <Meta 
                                    title="Photography" 
                                    description="Become a professional photographer with complete training from beginner to advanced photography techniques." />
                                </Card>
                            </Col>
                        </Row>
                    </div>

                </Card>
            </div>
        );
    }
}
export default CourseCards;