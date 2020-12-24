import { Card, Col, Row, Statistic } from "antd";
import React, { Component } from "react";
import photography from '../styles/images/photography.png'
import SEO from '../styles/images/seo-marketing.png'
import Blogging from '../styles/images/blogging-content.png'
import { Link } from "react-router-dom";

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
                        <Row gutter={16}>
                            <Col xs={24} md={12} lg={8}>
                                <Card
                                    className="card-item"
                                    cover={<img alt="photography" src={photography} />}
                                    actions={[
                                        <Link className="card-item-button">Joined Course</Link>
                                    ]}
                                >
                                    <Meta
                                        title="Photography"
                                        description={
                                            <div>
                                                <p>Become a professional photographer with complete training.</p>
                                                <div className="addon-info">
                                                    <span className="mr-8"><span className="icons videos" />10 Videos</span>
                                                    <span className="mr-8"><span className="icons lessons" />5 Lessons</span>
                                                </div>
                                            </div>} />
                                </Card>
                            </Col>
                            <Col xs={24} md={12} lg={8}>
                                <Card
                                    className="card-item"
                                    cover={<img alt="photography" src={Blogging} />}
                                    actions={[
                                        <Link className="card-item-button">Joined Course</Link>
                                    ]}
                                >
                                    <Meta
                                        title="Blogging, Content Marketing & Vlogging"
                                        description={
                                            <div>
                                                <p>Become a content marketing pro and learn what's involved in professional blogging.</p>
                                                <div className="addon-info">
                                                    <span className="mr-8"><span className="icons videos" />10 Videos</span>
                                                    <span className="mr-8"><span className="icons lessons" />5 Lessons</span>
                                                </div>
                                            </div>} />
                                </Card>
                            </Col>
                            <Col xs={24} md={12} lg={8}>
                                <Card
                                    className="card-item"
                                    cover={<img alt="photography" src={SEO} />}
                                    actions={[
                                        <Link className="card-item-button">Joined Course</Link>
                                    ]}
                                >
                                    <Meta
                                        title="SEO & Digital Marketing"
                                        description={
                                            <div>
                                                <p>Unlock the secrets to growing your visibility on Google with professionals.</p>
                                                <div className="addon-info">
                                                    <span className="mr-8"><span className="icons videos" />10 Videos</span>
                                                    <span className="mr-8"><span className="icons lessons" />5 Lessons</span>
                                                </div>
                                            </div>} />
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