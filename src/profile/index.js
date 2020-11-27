import React, { Component, createRef } from 'react';
import { Row, Col, Tabs, Card, Statistic, Avatar, Menu, Tooltip, Slider, Image, Upload, message } from 'antd';
import Invite from '../shared/components/Invite';
import Ads from '../components/ads';
import './profilestyle.css'
import PremiumBadge from '../styles/images/premiumbadge.svg'
import { Link } from 'react-router-dom';
import Courses from '../components/ProfileComponents/courses'
import FriendRequests from '../components/ProfileComponents/friendrequests';
import Friends from '../components/friends';
import Tags from '../components/ProfileComponents/tags';
import Groups from '../shared/components/Groups';
import Interests from '../components/ProfileComponents/interests';
import Hobbies from '../components/ProfileComponents/hobbies';
import About from '../components/ProfileComponents/about';
import Intership from '../components/ProfileComponents/internships';
import VideoProfile from '../components/ProfileComponents/videoprofile';
import Education from '../components/ProfileComponents/education';
import GroupsPage from '../components/ProfileComponents/groupspage';
import FriendsRequestsCard from '../shared/components/friendsRequests'
import CommonModal from '../components/ProfileComponents/CommonModal';
import Postings from '../shared/postings';
import { connect } from 'react-redux';
import { profileDetail } from '../shared/api/apiServer';
const { Meta } = Card;

const { TabPane } = Tabs;

    const props = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
class Profile extends Component {

    references = {};

    getOrCreateRef(id) {
        if (!this.references.hasOwnProperty(id)) {
            this.references[id] = createRef();
        }
        return this.references[id];
    }

    state = {
        navigations: [],
        profileData: {},
        disabled: false,
        visible: false
    };

    handleDisabledChange = disabled => {
        this.setState({ disabled });
    };

    componentDidMount() {
        profileDetail(this.props?.profile?.Id)
            .then(res => {
                const profiledata = res.data[0].User;
                const navigations = res.data[0].ProfileItems;
                this.setState({ profileData: profiledata,navigations:navigations });
            })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
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
                            <img className="center-focus" src={profileData.CoverPic||"https://via.placeholder.com/1200x400"} alt="profilecover" />
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
                                <Meta avatar={<div className="img-container">
                                {/* <Upload {...props}> */}
                                <Avatar src={profileData.ProfilePic} /> 
                                <a className="img-camera overlay"><span className="icons camera" /> </a>
                                {/* </Upload> */}
                                
                                </div>}
                                    title={<div>{profileData.Firstname} {profileData.Lastname}<span className="premium-icon"></span></div>}
                                    description={profileData.Branch}
                                />
                            </Card>
                            <CommonModal visible={visible} title="Edit Photo" cancel={this.handleCancel} saved={this.handleOk}>
                                <div className="">
                                    <div className=" upload-preview">
                                        <Image src={profileData.ProfilePic} />
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
                                <Statistic title="Internships" value={profileData.Internships?.length} />
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
                                       <Postings postingsType="user" sharebox={true}/>
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
                                            <div ref={this.getOrCreateRef('AboutComp')}>{profileData && <About about={profileData} />}</div>
                                        <div ref={this.getOrCreateRef('InterestComp')}>{profileData.Interests &&<Interests interests={profileData.Interests} />}</div>
                                        <div ref={this.getOrCreateRef('HobbyComp')}>{profileData.Hobbies &&<Hobbies hobbies={profileData.Hobbies} />}</div>
                                        <div ref={this.getOrCreateRef('InternshipComp')}>{profileData.Internships &&<Intership internships={profileData.Internships} />}</div>
                                        <div ref={this.getOrCreateRef('VideoComp')}>{profileData.VideoAsProfile &&<VideoProfile video={profileData.VideoAsProfile} />}</div>
                                        <div ref={this.getOrCreateRef('EducationComp')}>{profileData.Education &&<Education education={profileData.Education} />}</div>
                                        <div ref={this.getOrCreateRef('CourseComp')}>{profileData.Courses &&<Courses courses={profileData.Courses} />}</div>
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
                        <Groups />
                        <Ads />
                       
                    </Col>
                </Row>
            </div> : null
        )
    }
}

const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
 }

export default connect(mapStateToProps)(Profile);