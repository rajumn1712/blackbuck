import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Card, Statistic, Avatar, Menu, Anchor, Input, Modal, Button, Image, Tooltip, Slider, Switch,List,Form, Select } from 'antd';
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
const { Option } = Select;
const { TabPane } = Tabs;
const data = [
    {title: 'Programmers'} 
  ];


class Group extends Component {

    aboutRef = createRef(null);

    state = {
       
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
                                                avatar={<div><Avatar src={profileData.ProfilePic} /> <div className="text-center mt-8"><span className="f-20 fw-400">2.5K</span> Members</div><a onClick={this.showModal} className="img-camera"><span className="icons camera" /> </a></div>}
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
                <Row gutter={16}>
                            <Col xs={16}>
                                <Form.Item label="Education Type" className="custom-fields">
                                    <Select defaultValue="Select Option">
                                        <Option value="Select Option">Select State</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={16}>
                                <Form.Item label="College/University Name" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={16}>
                                <Form.Item label="Place of College/University" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={16}>
                                <Form.Item label="Marks Grade" className="custom-fields">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
            </div> : null
        )
    }
}

export default Group;