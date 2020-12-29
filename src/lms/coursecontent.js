import React, { Component } from 'react';
import { Card, List, Row, Col,Carousel } from 'antd'
import { Link } from 'react-router-dom';
import comingsoon from '../styles/images/coming-soon.png'
import '../index.css';
import '../App.css';

class CourseContent extends Component {
   
    render() {
        
        
        return (
            <div className="post-preview-box post-card comment-show">
                <Row gutter={24}>
                    <Col className="p-0" xs={24} sm={16} md={16} lg={17} >
                        <div className="preview-image">
                            <Carousel>
                                <div>
                                    <img src={comingsoon} />
                                </div>
                            </Carousel>
                           
                        </div>
                    </Col>
                    <Col className="p-0" xs={24} sm={8} md={8} lg={7}>
                        dfghj
                    </Col>
                </Row>
            </div>
        )
    }
}
export default CourseContent;