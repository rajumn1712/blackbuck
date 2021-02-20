import React, { Component, createRef } from "react";
import {
  Row,
  Col,
  Tabs,
  Card,
  Statistic,
  Avatar,
  Menu,
  Tooltip,
  Slider,
  Image,
  Upload,
  message,
  Button,
  Affix,
} from "antd";
import Invite from "../shared/components/Invite";
import Ads from "../components/ads";
import "./profilestyle.css";
import PremiumBadge from "../styles/images/premiumbadge.svg";
import { Link } from "react-router-dom";
import Courses from "../components/ProfileComponents/courses";
import Friends from "../components/friends";
import Tags from "../components/ProfileComponents/tags";
import Groups from "../shared/components/Groups";
import Interests from "../components/ProfileComponents/interests";
import Hobbies from "../components/ProfileComponents/hobbies";
import About from "../components/ProfileComponents/about";
import Intership from "../components/ProfileComponents/internships";
import VideoProfile from "../components/ProfileComponents/videoprofile";
import Education from "../components/ProfileComponents/education";
import Postings from "../shared/postings";
import { connect } from "react-redux";
import { profileDetail, getIsFriend, cancelFriendRequest, sendFirendRequest, acceptFrienRequest ,sendNotification} from "../shared/api/apiServer";
import notify from '../shared/components/notification';
import GroupsPage from "../shared/components/GroupsPage";
import defaultUser from "../styles/images/defaultuser.jpg";
import defaultCover from "../styles/images/defaultcover.png";
import ImgCrop from "antd-img-crop";
import { profileSuccess } from "../reducers/auth";
const { Meta } = Card;
const { Dragger } = Upload;

const { TabPane } = Tabs;

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
class ProfileView extends Component {
  references = {};
  postObject = {};

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
    visible: false,
    IsFriend: "",
    requestType: "",
    IsYouSendRequest: false
  };
  uploadProps = {
    name: "file",
    action: "http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile",
    onChange: ({ file, fileList }) => {
      const { status } = file;
      if (status !== "uploading") {
        this.postObject.ProfilePic = file.response;
      }
      if (status === "done") {
        message.success(`${file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${file.name} file upload failed.`);
      }
    },
    customRequest: () => {
      this.handleImageOk();
    },
  };

  handleDisabledChange = (disabled) => {
    this.setState({ disabled });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    this.checkWhetherFriendOrNot();
    profileDetail(this.props?.match?.params.userId).then((res) => {
      const profiledata = res.data[0].User;
      const navigations = res.data[0].ProfileItems;
      this.setState({ profileData: profiledata, navigations: navigations });
    });
  }
  checkWhetherFriendOrNot = () => {
    getIsFriend(this.props.profile?.Id, this.props?.match?.params.userId).then(res => {
      let { IsFriend, requestType, IsYouSendRequest } = this.state;
      IsFriend = res.data[0]?.IsFriend;
      requestType = res.data[0]?.type;
      IsYouSendRequest = res.data[0]?.IsYouSendRequest;
      this.setState({ ...this.state, IsFriend, requestType, IsYouSendRequest });
    })
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleImageOk = () => {
    console.log("dfhgdhgfhsdgfhsdfds");
  };
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleDomNavigate = (navigate) => {
    navigate.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };
  addFriend = async (friend) => {
    const obj = {
      "UserId": this.props?.profile?.Id,
      "Firstname": this.props?.profile?.FirstName,
      "Lastname": this.props?.profile?.LastName,
      "Image": this.props?.profile?.ProfilePic,
      "Email": this.props?.profile?.Email,
      "Type": "request",
      "CreatedDate":new Date()
    }
    sendFirendRequest(this.props?.match?.params.userId, obj).then(() => {
      let { requestType } = this.state;
      requestType = "request";
      this.setState({ ...this.state, requestType });
      sendNotification({to:this.props?.match?.params.userId,message:`${this.props?.profile?.FirstName} sent you friend request`,from:this.props?.profile?.Id});
      notify({ message: "Friend request", description: "Request sent successfully" });
    })
  }
  cancelRequest = async () => {
    const cancelResponse = await cancelFriendRequest(this.props?.profile?.Id, this.props?.match?.params.userId);
    if (cancelResponse.ok) {
      let { requestType } = this.state;
      requestType = "";
      this.setState({ ...this.state, requestType });
      notify({ message: "Friend request", description: "Request cancelled" });
    } else {
      notify({ message: "Friend request", description: "Something went wrong:)", type: "error" });
    }
  }
  handleAccept = async (friend) => {
    const obj = {
      UserId: this.props?.profile?.Id,
      Firstname: this.props?.profile?.FirstName,
      Lastname: this.props?.profile?.LastName,
      Image: this.props?.profile?.ProfilePic,
      Email: this.props?.profile?.Email,
      Type: "accept",
      CreatedDate: new Date(),
    };
    acceptFrienRequest(
      this.props.profile?.Id,
      this.props?.match?.params.userId,
      "accept",
      obj
    ).then(() => {
      this.checkWhetherFriendOrNot();
      message.success("Action Success");
      this.props.profile.Friends = this.props.profile.Friends
        ? this.props.profile.Friends + 1
        : 1;
      this.props.updateProfile(this.props.profile);
    });
  };

  handleRemove = () => {
    const obj = {
      UserId: this.props?.profile?.Id,
      Firstname: this.props?.profile?.FirstName,
      Lastname: this.props?.profile?.LastName,
      Image: null,
      Email: this.props?.profile?.Email,
      Type: "decline",
    };
    acceptFrienRequest(
      this.props.profile?.Id,
      this.props?.match?.params.userId,
      "decline",
      obj
    ).then(() => {
      this.checkWhetherFriendOrNot();
      message.success("Action Success");
    });
  };

  render() {
    const { navigations, profileData, disabled, visible, IsFriend, requestType, IsYouSendRequest } = this.state;
    return profileData ? (
      <div className="main">
        <Row gutter={16}>
          <Col xs={24} sm={16} md={16} lg={17} xl={17}>
            <div className="coverpage">
              <img
                className="center-focus"
                src={profileData.CoverPic || defaultCover}
                alt="profilecover"
              />
              <span className="premium-badge">
                <img src={PremiumBadge} />
              </span>
            </div>
            <div className="user-statistic">
              <div className="left-statistic">
                <Statistic
                  title="Friends"
                  className=""
                  value={profileData?.Friend ? profileData.Friend : 0}
                />
                <Statistic
                  className=""
                  title="Groups"
                  value={profileData?.Groups ? profileData.Groups : 0}
                />
                <Statistic
                  title="Posts"
                  value={profileData?.Posts ? profileData.Posts : 0}
                />
              </div>
              <Card className="user-banner">
                <Meta
                  avatar={
                    <div className="img-container">
                      <Avatar src={profileData.ProfilePic || defaultUser} />
                      {/* <a className="img-camera overlay"><span className="icons camera" /> </a> */}
                    </div>
                  }
                  title={
                    <div>
                      {profileData.Firstname} {profileData.Lastname}
                      <span className="premium-icon"></span>
                    </div>
                  }
                  description={profileData.Branch}
                />
              </Card>
              <div className="right-statistic">
                <Statistic
                  title="Shares"
                  className=""
                  value={profileData.Shares}
                />
                <Statistic
                  title="Interests"
                  className=""
                  value={profileData.Interest}
                />
                <Statistic
                  title="Internships"
                  value={profileData.Internships?.length}
                />
              </div>
            </div>
            <div className="profile-requestbtns">
              {!IsFriend && !requestType && <Button type="primary"  onClick={() => this.addFriend()}> Add Friend </Button>}
              {!IsFriend && requestType && IsYouSendRequest && <Button type="default" onClick={() => this.cancelRequest()} className="addfrnd semibold">Cancel Request</Button>}
              <div className="d-flex">
                {!IsFriend && requestType && !IsYouSendRequest && <Button type="primary"  onClick={() => this.handleAccept()}>Accept</Button>}
                {!IsFriend && requestType && !IsYouSendRequest && <Button type="default" onClick={() => this.handleRemove()} className="addfrnd semibold ml-8">Remove</Button>}
              </div>
            </div>
           
            <Tabs defaultActiveKey="1" className="profile-tabs">
              <TabPane tab="Profile" key="1">
                <Row gutter={16}>
                  {/* <Col xs={24} sm={8} md={8} lg={8} xl={8} className="profile-tab">
                                        <div className="left-rail">
                                            <Menu className="menu-items profile-menu" mode="vertical" title="Blackbuck">
                                                {navigations.map(navigatieItem => {
                                                    return <Menu.Item key={navigatieItem.Id}><Link onClick={() => this.handleDomNavigate(this.references[navigatieItem.Id])}><span className={navigatieItem.CssSprite}></span><span>{navigatieItem.Heading}</span></Link></Menu.Item>
                                                })}
                                            </Menu>
                                        </div>
                                        <Tags />
                                    </Col> */}
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div ref={this.getOrCreateRef("AboutComp")}>
                      {profileData && (
                        <About about={profileData} IsHideAction={true} />
                      )}
                    </div>
                    <div ref={this.getOrCreateRef("InterestComp")}>
                      {profileData.Interests && (
                        <Interests
                          interests={profileData.Interests}
                          IsHideAction={true}
                        />
                      )}
                    </div>
                    <div ref={this.getOrCreateRef("HobbyComp")}>
                      {profileData.Hobbies && (
                        <Hobbies
                          hobbies={profileData.Hobbies}
                          IsHideAction={true}
                        />
                      )}
                    </div>
                    <div ref={this.getOrCreateRef("InternshipComp")}>
                      {profileData.Internships && (
                        <Intership
                          internships={profileData.Internships}
                          IsHideAction={true}
                        />
                      )}
                    </div>
                    <div ref={this.getOrCreateRef("VideoComp")}>
                      {profileData.VideoAsProfile && (
                        <VideoProfile
                          video={profileData.VideoAsProfile}
                          IsHideAction={true}
                        />
                      )}
                    </div>
                    <div ref={this.getOrCreateRef("EducationComp")}>
                      {profileData.Education && (
                        <Education
                          education={profileData.Education}
                          IsHideAction={true}
                        />
                      )}
                    </div>
                    <div ref={this.getOrCreateRef("CourseComp")}>
                      {profileData.Courses && (
                        <Courses
                          courses={profileData.Courses}
                          loadUserCourse={true}
                          IsHideAction={true}
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Posts" key="2">
                <Row gutter={16}>
                  <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                    <Courses />
                  </Col>
                  <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                    <Postings
                      postingsType="user"
                      sharebox={false}
                      userId={this.props.match.params.userId}
                      key={this.props.match.params.userId}
                      postActions={false}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Friends" key="3">
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Friends
                      userId={this.props.match.params.userId}
                      key={this.props.match.params.userId}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Groups" className="m-0" key="4">
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <GroupsPage userId={this.props.match.params.userId} IsHideAction={true} />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>

          </Col>
          <Col xs={24} sm={8} md={8} lg={7} xl={7}>
            {/* <FriendsSuggestioncard /> */}
            <Groups
              userId={this.props.match.params.userId}
              key={this.props.match.params.userId}
            />
            <div className="affix-top">
              <Ads />
            </div>
          </Col>
        </Row>
      </div>
    ) : null;
  }
}

const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (info) => {
      dispatch(profileSuccess(info));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
