import React, { Component, createRef } from 'react';
// import { connect } from 'react-redux';
import { Row, Col, Tabs, Card, Statistic, Avatar, Menu, Anchor, Input, Modal, Button, Image, Tooltip, Slider, Switch,List } from 'antd';
import ShareBox from '../components/SavePostBox/sharebox';
import Invite from '../components/invite';
import Ads from '../components/ads';
import PostCard from '../components/postcard/Post';
import './groupstyle.css'
import PadLock from '../styles/images/padlock.svg'
import { Link } from 'react-router-dom';
import Courses from '../components/ProfileComponents/courses'
import Groups from '../shared/components/Groups';
import FriendsRequestsCard from '../shared/components/friendsRequests'
import { apiClient } from '../shared/api/clients';
import CommonModal from '../components/ProfileComponents/CommonModal';
const { Meta } = Card;

const { TabPane } = Tabs;
const data = [
    {title: 'Programmers'} 
  ];

const navigations =
    [
        {
            "Heading": "About Me",
            "Url": "/aboutme",
            "CssSprite": "left-menu profile-icon",
            "IsActive": false
        },
        {
            "Heading": "Interests",
            "Url": "/interests",
            "CssSprite": "left-menu interest",
            "IsActive": false
        },
        {
            "Heading": "Hobbies",
            "Url": "/hobbies",
            "CssSprite": "left-menu hobbies",
            "IsActive": false
        },
        {
            "Heading": "Internships",
            "Url": "/internships",
            "CssSprite": "left-menu intenship",
            "IsActive": false
        },
        {
            "Heading": "Video as Profile",
            "Url": "/videoprofile",
            "CssSprite": "left-menu play",
            "IsActive": false
        },
        {
            "Heading": "Education",
            "Url": "/education",
            "CssSprite": "left-menu education",
            "IsActive": false
        },
        {
            "Heading": "Courses",
            "Url": "/courses",
            "CssSprite": "left-menu courses",
            "IsActive": false
        },
        {
            "Heading": "Groups",
            "Url": "/profilegroups",
            "CssSprite": "left-menu group-icon",
            "IsActive": false
        }
    ]
class Group extends Component {

    aboutRef = createRef(null);

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
                            <span className="padlock"><img src={PadLock} /></span>
                            <Link to="#" className="editpost">
                                <span className="left-menu post-icon" />
                            </Link>

                        </div>
                        <div className="user-statistic">
                            <Card className="user-banner" >
                                {/* <Meta avatar={<div><Avatar src={profileData.ProfilePic} /> <a onClick={this.showModal} className="img-camera"><span className="icons camera" /> </a></div>}
                                    title={<div>sdfghjk</div>}
                                    description={<div>ASDFGH</div>}
                                /> */}


                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<div className="img-container"><Avatar src={profileData.ProfilePic} /> <div className="text-center mt-8"><span className="f-20 fw-400">2.5K</span> Members</div><a onClick={this.showModal} className="img-camera overlay"><span className="icons camera" /> </a></div>}
                                                title={<a href="https://ant.design">{item.title}</a>}
                                                description={<div><div className="f-12">Private Group</div><div className="f-12">Created on <span className="fw-400">31-10-2020</span></div></div>}
                                            />
                                        </List.Item>
                                    )}
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
                        </div>
                        <Tabs defaultActiveKey="1" centered className="profile-tabs">
                            <TabPane tab="About" key="3">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>

                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>

                                    </Col>
                                </Row>
                            </TabPane>
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

export default Group;