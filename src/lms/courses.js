import { Col, Row } from "antd";
import React, { Component } from "react";
import Ads from "../components/ads";
import OwlCarousel from 'react-owl-carousel2';
import CourseBanner1 from '../styles/images/Coursebanner1.png'

const options = {
    items: 1,
    nav: false,
    autoplay: false,
    dots: true,

};

class Courses extends Component {
    render() {
        return (
            <div>
                <Row gutter={16}>
                    <Col xs={24}>
                        <div className="coverpage coursesbanner">
                            <OwlCarousel options={options}>
                                <div className="coursebanneritem">
                                    <img src={CourseBanner1} alt="The Last of us" />
                                    <div className="coursebannertext">
                                        <h2 className="coursebannertitle">Aerodynamics</h2>
                                        <p className="coursebannerdescp">This course extends fluid mechanic concepts from Unified Engineering to the aerodynamic performance of wings and bodies in sub/supersonic regimes.</p>
                                    </div>
                                </div>
                                <div className="coursebanneritem">
                                    <img src={CourseBanner1} alt="The Last of us" />
                                    <div className="coursebannertext">
                                        <h2 className="coursebannertitle">Aerodynamics</h2>
                                        <p className="coursebannerdescp">This course extends fluid mechanic concepts from Unified Engineering to the aerodynamic performance of wings and bodies in sub/supersonic regimes.</p>
                                    </div>
                                </div>
                                <div className="coursebanneritem">
                                    <img src={CourseBanner1} alt="The Last of us" />
                                    <div className="coursebannertext">
                                        <h2 className="coursebannertitle">Aerodynamics</h2>
                                        <p className="coursebannerdescp">This course extends fluid mechanic concepts from Unified Engineering to the aerodynamic performance of wings and bodies in sub/supersonic regimes.</p>
                                    </div>
                                </div>
                            </OwlCarousel>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Courses;