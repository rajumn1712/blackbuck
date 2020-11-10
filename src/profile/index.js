import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Card, Statistic,Avatar } from 'antd';
import ShareBox from '../components/sharebox';
import Identity from '../components/identity';
import Invite from '../components/invite';
import GroupCard from '../components/groupcard';
import Ads from '../components/ads';
import FriendSuggestions from '../components/FriendSuggestions';
import PostCard from '../components/postcard/Post';
import profilebanner from '../styles/images/banner.svg'
import './profilestyle.css'
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import AvatarImage from '../styles/images/avatar.png';
import PremiumBadge from '../styles/images/premiumbadge.svg'
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
                        </div>
                        <div className="user-statistic ">
                            <Statistic title="Friends" className="afterline" value={58} />
                            <Statistic className="afterline" title="Groups" value={8} />
                            <Statistic title="Posts" value={10} />
                            <Card className="user-banner"
                            >
                                <Meta
                                    avatar={
                                        <Avatar src={AvatarImage} />
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
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                        <ShareBox />
                                        <PostCard />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Profile" key="2">
                                Content of Tab Pane 2</TabPane>
                            <TabPane tab="Friends" key="3">
                                Content of Tab Pane 3</TabPane>
                            <TabPane tab="Groups" className="m-0" key="4">
                                Content of Tab Pane 4</TabPane>
                        </Tabs>

                        {/* <Row gutter={16}>
                            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                <Invite />
                            </Col>
                            <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                <ShareBox />
                                <PostCard />
                            </Col>
                        </Row> */}
                        {/* <FriendSuggestions /> */}

                    </Col>
                    <Col xs={24} sm={8} md={8} lg={6} xl={6}>
                        <Ads />
                        <GroupCard />

                    </Col>
                </Row>
            </div>
        )
    }
}

export default Profile;