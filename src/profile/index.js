import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Card, Statistic, Avatar, Menu, Anchor, Input, Modal, Button, Image, Tooltip, Slider, Switch } from 'antd';
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
import Courses from '../components/ProfileComponents/courses'
import FriendsSuggestioncard from '../components/FriendsSuggestioncard';
import FriendRequests from '../components/ProfileComponents/friendrequests';
import Friends from '../components/friends';
import Tags from '../components/tags';
import Groups from '../components/groups';
import Interests from '../components/ProfileComponents/interests';
import Hobbies from '../components/ProfileComponents/hobbies';
import About from '../components/ProfileComponents/about';
import Intership from '../components/ProfileComponents/internships';
import VideoProfile from '../components/ProfileComponents/videoprofile';
import Education from '../components/ProfileComponents/education';
import GroupsPage from '../components/ProfileComponents/groupspage';
import FriendsRequestsCard from '../shared/components/friendsRequests'
import { apiClient } from '../shared/api/clients';
import CommonModal from '../components/ProfileComponents/CommonModal';
const { Meta } = Card;

const { TabPane } = Tabs;

const navigations =
    [
        {
            "Heading": "About Me",
            "Url": "/aboutme",
            "CssSprite": "left-menu profile-icon",
            "IsActive": false,
            "Id": "AboutComp"
        },
        {
            "Heading": "Interests",
            "Url": "/interests",
            "CssSprite": "left-menu interest",
            "IsActive": false,
            "Id": "InterestComp"
        },
        {
            "Heading": "Hobbies",
            "Url": "/hobbies",
            "CssSprite": "left-menu hobbies",
            "IsActive": false,
            "Id": "HobbyComp"
        },
        {
            "Heading": "Internships",
            "Url": "/internships",
            "CssSprite": "left-menu intenship",
            "IsActive": false,
            "Id": "InternshipComp"
        },
        {
            "Heading": "Video as Profile",
            "Url": "/videoprofile",
            "CssSprite": "left-menu play",
            "IsActive": false,
            "Id": "VideoComp"
        },
        {
            "Heading": "Education",
            "Url": "/education",
            "CssSprite": "left-menu education",
            "IsActive": false,
            "Id": "EducationComp"
        },
        {
            "Heading": "Courses",
            "Url": "/courses",
            "CssSprite": "left-menu courses",
            "IsActive": false,
            "Id": "CourseComp"
        }
    ]
class Profile extends Component {

    references = {};

    getOrCreateRef(id) {
        if (!this.references.hasOwnProperty(id)) {
            this.references[id] = createRef();
        }
        return this.references[id];
    }

    state = {
        navigations: navigations,
        profileData: {},
        disabled: false,
        visible: false
    };

    handleDisabledChange = disabled => {
        this.setState({ disabled });
    };

    componentDidMount() {
        apiClient.get('service/api/profile/getProfileDetail/1')
            .then(res => {
                const profiledata = res.data[0];
                this.setState({ profileData: profiledata });
            })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleDomNavigate = (navigate) => {
        navigate.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    render() {

        const { navigations, profileData, disabled, visible } = this.state;
        return (
            profileData ? <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={16} md={16} lg={18} xl={18}>
                        <div className="coverpage">
                            <img className="center-focus" src={profileData.CoverPic} alt="profilecover" />
                            <span className="premium-badge"><img src={PremiumBadge} /></span>
                            <Link to="#" className="editpost" >
                                <span className="left-menu post-icon" />
                            </Link>

                        </div>
                        <div className="user-statistic">
                            <div className="left-statistic">
                                <Statistic title="Friends" className="afterline" value={profileData.Friend} />
                                <Statistic className="afterline" title="Groups" value={profileData.Groups} />
                                <Statistic title="Posts" value={profileData.Posts} />
                            </div>
                            <Card className="user-banner" >
                                <Meta avatar={<div><Avatar src={profileData.ProfilePic} /> <a onClick={this.showModal} className="img-camera"><span className="icons camera" /> </a></div>}
                                    title={<div>{profileData.Firstname} {profileData.Lastname}<span className="premium-icon"></span></div>}
                                    description={profileData.Branch}
                                />
                            </Card>
                            <CommonModal visible={visible} title="Edit Photo" cancel={this.handleCancel} saved={this.handleOk}>
                                <div className="">
                                    <div className=" upload-preview">
                                        {/* <Image src={profileData.ProfilePic} /> */}
                                        <a class="item-close">
                                            <Tooltip title="Remove">
                                                <span className="close-icon"></span>
                                            </Tooltip>
                                        </a>
                                    </div>
                                    <div>
                                        <Slider defaultValue={30} disabled={disabled} />
                                    </div>

                                </div>
                            </CommonModal>
                            <div className="right-statistic">
                                <Statistic title="Shares" className="afterline" value={profileData.Shares} />
                                <Statistic title="Interests" className="afterline" value={profileData.Interest} />
                                <Statistic title="Internships" value={3} />
                            </div>
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
                                                {navigations.map(navigatieItem => {
                                                    return <Menu.Item key={navigatieItem.Id}><Link onClick={() => this.handleDomNavigate(this.references[navigatieItem.Id])}><span className={navigatieItem.CssSprite}></span><span>{navigatieItem.Heading}</span></Link></Menu.Item>
                                                })}
                                            </Menu>
                                        </div>
                                        <Invite />
                                        <Tags />
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                        <div ref={this.getOrCreateRef('AboutComp')}><About about={profileData} /></div>
                                        <div ref={this.getOrCreateRef('InterestComp')}><Interests interests={profileData.Interests} /></div>
                                        <div ref={this.getOrCreateRef('HobbyComp')}><Hobbies hobbies={profileData.Hobbies} /></div>
                                        <div ref={this.getOrCreateRef('InternshipComp')}><Intership internships={profileData.Internships} /></div>
                                        <div ref={this.getOrCreateRef('VideoComp')}><VideoProfile video={profileData.VideoAsProfile} /></div>
                                        <div ref={this.getOrCreateRef('EducationComp')}><Education education={profileData.Education} /></div>
                                        <div ref={this.getOrCreateRef('CourseComp')}><Courses courses={profileData.Courses} /></div>
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
                                        <GroupsPage />
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={6} xl={6}>
                        {/* <FriendsSuggestioncard /> */}
                        <FriendsRequestsCard />
                        <Ads />
                        <Groups />
                    </Col>
                </Row>
            </div> : null
        )
    }
}

export default Profile;