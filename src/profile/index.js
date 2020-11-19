import React, { Component } from 'react';
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
import Courses from '../components/courses'
import FriendsSuggestioncard from '../components/FriendsSuggestioncard';
import FriendRequests from '../shared/components/friendrequests';
import Friends from '../components/friends';
import Tags from '../components/tags';
import Groups from '../components/groups';
import Interests from '../components/ProfileComponents/interests';
import Hobbies from '../components/ProfileComponents/hobbies';
import About from '../components/ProfileComponents/about';
import Intership from '../components/internships';
import VideoProfile from '../components/videoprofile';
import Education from '../components/education';
import GroupsPage from '../components/groupspage';
import FriendsRequestsCard from '../shared/components/friendsRequests'
const { Meta } = Card;

const { TabPane } = Tabs;

class Profile extends Component {
    state = {
        disabled: false,
    };

    handleDisabledChange = disabled => {
        this.setState({ disabled });
    };

    componentDidMount() {

    }
    state = { visible: false };
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

    render() {
        const { disabled } = this.state;
        return (
            <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={16} md={16} lg={18} xl={18}>
                        <div className="coverpage">
                            <img className="center-focus" src={profilebanner} alt="profilecover" />
                            <span className="premium-badge"><img src={PremiumBadge} /></span>
                            <Link to="#" className="editpost">
                                <span className="left-menu post-icon" />
                            </Link>

                        </div>
                        <div className="user-statistic">
                            <div className="left-statistic">
                                <Statistic title="Friends" className="afterline" value={58} />
                                <Statistic className="afterline" title="Groups" value={8} />
                                <Statistic title="Posts" value={10} />
                            </div>
                            <Card className="user-banner" >
                                <Meta avatar={<div><Avatar src={AvatarImage} /> <a onClick={this.showModal} className="img-camera"><span className="icons camera" /> </a></div>}
                                    title={<div>John Doe<span className="premium-icon"></span></div>}
                                    description="CSE"
                                />
                            </Card>
                            <Modal
                                title={<div className="custom-modal-header"><h4>Edit Profile Photo</h4><a onClick={this.handleCancel}><span className="close-icon" /></a></div>}
                                visible={this.state.visible}
                                closable={false}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={[<div className="d-flex justify-content-between">
                                    <Button key="back" onClick={this.handleCancel} className="btn-cancel">
                                        Close
                                    </Button>
                                    <Button key="submit" type="primary" onClick={this.handleOk}>
                                        Save
                                    </Button></div>
                                ]}>
                                <div className="">
                                    <div className=" upload-preview">
                                        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
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

                            </Modal>
                            <div className="right-statistic">
                                <Statistic title="Shares" className="afterline" value={80} />
                                <Statistic title="Interests" className="afterline" value={9} />
                                <Statistic title="Posts" value={10} />
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
                                        <Education />
                                        <Courses />
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
            </div>
        )
    }
}

export default Profile;