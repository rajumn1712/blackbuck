import { Card, Col, Row, Statistic } from "antd";
import React, { Component } from "react";
import Ads from "../components/ads";
import OwlCarousel from 'react-owl-carousel2';
import CourseBanner1 from '../styles/images/Coursebanner1.png'

const { Meta } = Card;
const options = {
    items: 1,
    nav: false,
    autoplay: true,
    dots: true,

};

class Courses extends Component {
    render() {
        return (
            <div className="coursepage">
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
                        <div className="user-statistic">
                            <div className="left-statistic">
                                <Statistic
                                    title="Total Courses"
                                    className="afterline"
                                    value='0'
                                />
                                <Statistic
                                    title="Free Courses"
                                    value='0'
                                />

                            </div>

                            <div className="bannercard-title">
                                MY Courses
                            </div>

                            <div className="right-statistic">
                                <Statistic
                                    title="Joined Courses"
                                    className="afterline"
                                    value='0'
                                />
                                <Statistic
                                    title="Favorites"
                                    value='0'
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Courses;