import { Card, Col, Row, Statistic, Avatar, Tabs } from "antd";
import React, { Component } from "react";
import Ads from "../components/ads";
import OwlCarousel from 'react-owl-carousel2';
import CourseBanner1 from '../styles/images/Coursebanner1.png'
import defaultUser from '../styles/images/defaultuser.jpg';

const { Meta } = Card;
const options = {
    items: 1,
    nav: false,
    autoplay: true,
    dots: true,

};
const { TabPane } = Tabs;
class Courses extends Component {
    state = {
        navigations: [],
        profileData: {},
        disabled: false,
        visible: false,
    };
    render() {
        const { profileData } = this.state;
        return (
            <div className="coursepage">
                <div className="coverpage coursesbanner">
                    <OwlCarousel options={options}>
                        <div className="coursebanneritem">
                            <img src={CourseBanner1} alt="The Last of us" />
                            <div className="coursebannertext ">
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
            </div>
        );
    }
}
export default Courses;