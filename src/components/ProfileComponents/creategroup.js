import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Card, Statistic, Avatar, Menu, Anchor, Input, Modal, Button, Image, Tooltip, Slider, Switch, List, Form, Radio } from 'antd';
import ShareBox from '../components/SavePostBox/sharebox';
import Identity from '../components/identity';
import Invite from '../components/invite';
import Ads from '../components/ads';
import FriendSuggestions from '../components/FriendSuggestions';
import PostCard from '../components/postcard/Post';
import profilebanner from '../styles/images/banner.svg'
import './groupstyle.css'
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import AvatarImage from '../styles/images/avatar.png';
import PadLock from '../styles/images/padlock.svg'
import { Link } from 'react-router-dom';
import Courses from '../components/ProfileComponents/courses'
import FriendsSuggestioncard from '../components/FriendsSuggestioncard';
import FriendRequests from '../components/ProfileComponents/friendrequests';
import Friends from '../components/friends';
import Tags from '../components/tags';
import Groups from '../shared/components/Groups';
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
const data = [
    { title: 'Programmers' }
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
    state = {
        value: 1,
      };
    
      onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
          value: e.target.value,
        });
      };
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
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const { value } = this.state;
        return (
            profileData ? <div className="main">
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
                                <div className="my-16">
                                    <Form layout="vertical" >
                                        <Row gutter={24}>
                                            <Col xs={16}>
                                                <Form.Item label="Group Name" className="custom-fields">
                                                    <Input placeholder="Enter group name here" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={16}>
                                                <Form.Item label="Description" className="custom-fields">
                                                    <Input placeholder="Enter description here" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={16}>
                                                <Form.Item label="Location" className="custom-fields">
                                                    <Input placeholder="Add a Location to your group" />
                                                </Form.Item>
                                            </Col>
                                            {/* <Col xs={16}>
                                            <Radio.Group  onChange={this.onChange} value={value}>
                                                <Radio style={radioStyle} value={1}>Option A</Radio>
                                                <Radio style={radioStyle} value={2}>Option B</Radio>
                                            </Radio.Group>
                                            </Col> */}
                                        </Row>
                                    </Form>
                                </div>
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
                    </Col>
                </Row>
            </div> : null
        )
    }
}

export default Group;