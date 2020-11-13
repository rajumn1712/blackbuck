import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Card, Statistic, Avatar, Menu, Anchor } from 'antd';
import ShareBox from '../components/sharebox';
import Identity from '../components/identity';
import Invite from '../components/invite';
import Ads from '../components/ads';
import FriendSuggestions from '../components/FriendSuggestions';
import PostCard from '../components/postcard/Post';
import profilebanner from '../styles/images/banner.svg'
import './profilestyle.css'
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import AvatarImage from '../styles/images/avatar.png';
import PremiumBadge from '../styles/images/premiumbadge.svg'
import { Link } from 'react-router-dom';
import Courses from '../components/courses'
import FriendsSuggestioncard from '../components/FriendsSuggestioncard';
import FriendRequests from '../components/friendrequests';
import Friends from '../components/friends';
import Tags from '../components/tags';
import Groups from '../components/groups';
import Interests from '../components/interests';
import Hobbies from '../components/hobbies';
import About from '../components/about';
import Intership from '../components/internships';
import VideoProfile from '../components/videoprofile';
const { Meta } = Card;

const { TabPane } = Tabs;

class Profile extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={16} md={16} lg={18} xl={18}>
                        <div className="coverpage">
                            <img src={profilebanner} alt="profilecover" />
                            <span className="premium-badge"><img src={PremiumBadge} /></span>
                            <Link to="#" className="editpost">
                                <span className="left-menu post-icon" />
                            </Link>

                        </div>
                        <div className="user-statistic ">
                            <Statistic title="Friends" className="afterline" value={58} />
                            <Statistic className="afterline" title="Groups" value={8} />
                            <Statistic title="Posts" value={10} />
                            <Card className="user-banner"
                            >
                                <Meta
                                    avatar={
                                        <div>
                                            <Avatar src={AvatarImage} />
                                            {/* <span className="icons camera" /> */}
                                        </div>
                                    }
                                    title={<div>John Doe<span className="premium-icon"></span></div>}
                                    description="CSE"
                                />
                            </Card>
                            <Statistic title="Shares" className="afterline" value={80} />
                            <Statistic title="Interests" className="afterline" value={9} />
                            <Statistic title="Posts" value={10} />
                        </div>
                        <Tabs defaultActiveKey="1" centered className="profile-tabs">
                            <TabPane tab="Posts" key="1">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                        <Courses />
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                        <ShareBox />
                                        <PostCard />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Profile" key="2">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8} className="profile-tab">
                                        <div className="left-rail">
                                            <Menu className="menu-items profile-menu" mode="vertical" title="Blackbuck">
                                                <Menu.Item key="AboutMe"><Link to="#AboutMe"><span className="left-menu profile-icon"></span><span>About Me</span></Link></Menu.Item>
                                                <Menu.Item key="Interests"><Link to="/"><span className="left-menu interest"></span><span>Interests</span></Link></Menu.Item>
                                                <Menu.Item key="Hobbies"><Link to="#Hobbies"><span className="left-menu hobbies"></span><span>Hobbies</span></Link></Menu.Item>
                                                <Menu.Item key="Intenships"><Link to="/"><span className="left-menu intenship"></span><span>Intenships</span></Link></Menu.Item>
                                                <Menu.Item key="VideoProfile"><Link to="/"><span className="left-menu play"></span><span>Video as Profile</span></Link></Menu.Item>
                                                <Menu.Item key="Education"><Link to="/"><span className="left-menu education"></span><span>Education</span></Link></Menu.Item>
                                                <Menu.Item key="Courses"><Link to="/"><span className="left-menu courses"></span><span>Courses</span></Link></Menu.Item>
                                                <Menu.Item key="Groups"><Link to="/"><span className="left-menu group-icon"></span><span>Groups</span></Link></Menu.Item>
                                            </Menu>
                                        </div>
                                        <Invite />
                                        <Tags />
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                        <About />
                                        <Interests />
                                        <Hobbies />
                                        <Intership />
                                        <VideoProfile />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Friends" key="3">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                        <FriendRequests />
                                        <Friends />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Groups" className="m-0" key="4">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>

                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={6} xl={6}>
                        <FriendsSuggestioncard />
                        <Ads />
                        <Groups />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Profile;