import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Card, Statistic, Avatar } from 'antd';
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
import Groups from '../components/groups';
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
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>

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