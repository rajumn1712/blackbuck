import React, { Component, createRef } from "react";
import {
  Row,
  Col,
  Tabs,
  Card,
  Statistic,
  Avatar,
  Tooltip,
  Upload,
  message,
  Button,
  Affix,
} from "antd";
import Invite from "../shared/components/Invite";
import Ads from "../components/ads";
import "./profilestyle.css";
import PremiumBadge from "../styles/images/premiumbadge.svg";
import defaultCover from "../styles/images/default-cover.png";
import { Route, withRouter } from "react-router-dom";
import Courses from "../components/ProfileComponents/courses";
import FriendRequests from "../components/ProfileComponents/friendrequests";
import Friends from "../components/friends";
import Groups from "../shared/components/Groups";
import GroupsPage from "../shared/components/GroupsPage";
import ContestsPage from "../shared/components/ContestsPage";
import Postings from "../shared/postings";
import { connect } from "react-redux";
import { saveProfileImage } from "../shared/api/apiServer";
import defaultUser from "../styles/images/defaultuser.jpg";
// import defaultCover from "../styles/images/defaultcover.png";
import ImgCrop from "antd-img-crop";
import { profileSuccess } from "../reducers/auth";
import { store } from "../store";
import ProfileDetail from "./profileDetail";
import Loader from "../common/loader";
import notify from "../shared/components/notification";
import { apiClient } from '../shared/api/clients';
import Notifications from '../components/notification';
import CommonModal from '../components/ProfileComponents/CommonModal';
import CreateContest from '../contest/createcontest'
const { Meta } = Card;
const { TabPane } = Tabs;

class Profile extends Component {
  // references = {};
  imageObject = {};
  storeSubscription;
  // getOrCreateRef(id) {
  //   if (!this.references.hasOwnProperty(id)) {
  //     this.references[id] = createRef();
  //   }
  //   return this.references[id];
  // }

  state = {
    isProfilePic: false,
    isDataRefresh: false,
    loading: false,
    imageLoader: false,
    profile: this.props?.profile,
    tabkey: this.props?.match.params.tabkey,
    showDownload: false,
    isModal: false,
    contest: null,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.tabkey == this.props?.match?.params.tabkey) {
      return;
    } else {
      let { tabkey } = this.state;
      tabkey = nextProps.match.params.tabkey;
      this.setState({ ...this.state, tabkey })
    }
  };
  isDataRefreshed = (refresh) => {
    if (refresh) this.friends.getFriends();
  };
  uploadProps = {
    name: "file",
    multiple: false,
    fileList: [],
    customRequest: ({ file }) => {
      let formData = new FormData();
      formData.append(
        "file",
        file,
        file.name +
        `${this.state.isProfilePic ? "profile_" : "cover_"}${this.props?.profile?.Id
        }`
      );
      apiClient
        .post(process.env.REACT_APP_AUTHORITY + "/Home/UploadFile", formData)
        .then((res) => {
          if (res.ok) {
            this.imageObject.ImageUrl = res.data[0];
            this.handleImageOk();
          }
          else {
            notify({
              message: "Error",
              description: 'Something went wrong',
              type: 'error'
            })
          }
        });
    },
    // action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
    // onChange: ({ file }) => {
    //   console.log(this.state.isProfilePic)
    //   this.setState({...this.state,isProfilePic:this.state.isProfilePic})
    // },
  };

  handleDisabledChange = (disabled) => {
    this.setState({ disabled });
  };

  showModal = () => {
    this.setState({ ...this.state, isModal: true });
  }
  componentDidMount() {
    this.storeSubscription = store.subscribe(() => {
      const { profile } = store.getState().oidc;
      this.setState({ ...this.state, profile });
    });
  }
  componentWillUnmount() {
    this.storeSubscription();
  }

  handleBeforUpload = (file) => {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJPG) {
      message.error("You can only upload JPG or PNG file!");
      return false;
    } else {
      return true;
    }
  };
  handleImageOk = () => {
    this.setState({ ...this.state, imageLoader: true })
    const imageType = this.state.isProfilePic ? "ProfilePic" : "CoverPic";
    saveProfileImage(this.props?.profile?.Id, imageType, this.imageObject).then(
      (res) => {
        if (this.state.isProfilePic) {
          this.props.profile.ProfilePic = this.imageObject.ImageUrl;
        } else {
          this.props.profile.CoverPic = this.imageObject.ImageUrl;
        }
        this.props.updateProfile(this.props.profile);
        this.imageObject = {};
        this.setState({ ...this.state, imageLoader: false }, () => {
          notify({
            description: `${this.state.isProfilePic ? "Profile picture" : "Cover picture"
              } uploaded successfully.`,
            message: "Upload",
          });
        })
      }
    );
  };
  // handleDomNavigate = (navigate) => {
  //   navigate.current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "nearest",
  //   });
  // };
  handleTabChange = (index) => {
    this.props.history.push(`/profile/${index}`);
    this.setState({ tabkey: index });
  };
  saveContest = () => {
    this.state.contest.handleSave()
  }

  render() {
    const { isDataRefresh, profile, tabkey, imageLoader, isModal } = this.state;
    // if (this.state.loading) {
    //   return <Loader className="loader-top-middle" />;
    // }

    return (
      <div className="main">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16} lg={17} xl={17}>
            <div className="coverpage">
              <Avatar
                className="center-focus"
                src={profile?.CoverPic || defaultCover}
              />
              {this.props?.profile?.IsScholar && <span className="premium-badge">
                <img src={PremiumBadge} />
              </span>}
              <ImgCrop
                aspect={6 / 2}
                grid={true}
                beforeCrop={this.handleBeforUpload}
                cropperProps={{
                  cropSize: { width: 1000, height: 400 },
                  cropShape: "round",
                }}
              >
                <Upload {...this.uploadProps} onChange={() => this.setState({ isProfilePic: false })}>
                  <Tooltip title="Change Coverphoto">
                    <a
                      className="editpost"
                    >
                      <span className="left-menu camera-icon" />
                    </a>
                  </Tooltip>
                </Upload>
              </ImgCrop>
            </div>
            <div className="user-statistic">
              <div className="left-statistic">
                <Statistic
                  title="Friends"
                  className=""
                  value={profile?.Friends ? profile.Friends : 0}
                />
                <Statistic
                  className=""
                  title="Groups"
                  value={profile?.Groups ? profile.Groups : 0}
                />
                <Statistic
                  className=""
                  title="Posts"
                  value={profile?.Posts ? profile.Posts : 0}
                />
              </div>
              <Card className="user-banner">
                <Meta
                  avatar={
                    <div className="">
                      <ImgCrop
                        shape="round"
                        beforeCrop={this.handleBeforUpload}
                      >
                        <Upload {...this.uploadProps} onChange={() => this.setState({ isProfilePic: true })}>
                          {imageLoader && <Loader className="loader-top-middle" />}
                          <Avatar src={profile?.ProfilePic || defaultUser} />
                          <Tooltip placement="top" title="Change Photo">
                            <a
                              className="img-camera"
                            >
                              <span className="left-menu camera-icon" />{" "}
                            </a>
                          </Tooltip>
                        </Upload>
                      </ImgCrop>
                    </div>
                  }
                  title={
                    <div className="user-name">
                      {profile?.FirstName} {profile?.LastName}
                    </div>
                  }
                  description={profile?.Branch}
                />
              </Card>
              <div className="right-statistic">
                <Statistic
                  title="Shares"
                  className=""
                  value={profile?.Shares ? profile?.Shares : 0}
                />
                <Statistic
                  title="Interests"
                  className=""
                  value={profile?.Interests ? profile?.Interests : 0}
                />
                <Statistic title="Internships" value={profile?.Internships ? profile?.Internships : 0} />
              </div>
            </div>
            <Tabs
              defaultActiveKey={tabkey}
              className="profile-tabs"
              onChange={this.handleTabChange}
              key={tabkey}
              tabBarExtraContent={tabkey == "IsProfileContestTab" ? <div className="mx-8 mb-8">
                <Button type="primary" onClick={this.showModal} > Create Contest </Button>
              </div> : []}
            >
              <TabPane tab="Profile" key="IsProfileTab">
                <Route
                  path="/profile/IsProfileTab"
                  render={() => {
                    return (
                      <div>
                        {this.state.loading && (
                          <Loader className="loader-top-middle" />
                        )}
                        <ProfileDetail id={this.props?.profile?.Id} onRef={(profiledetails) => this.getDetails = profiledetails} />
                      </div>
                    );
                  }}
                />
              </TabPane>
              <TabPane tab="Posts" key="IsProfilePostsTab">
                <Route
                  path="/profile/IsProfilePostsTab"
                  render={() => {
                    return (
                      <Row gutter={8}>
                        <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} lg={{ span: 8, order: 1 }} xl={8}>
                          <Invite />
                          <Courses />
                        </Col>
                        <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} lg={{ span: 16, order: 2 }} xl={16}>
                          <Postings postingsType="user" sharebox={true} />
                        </Col>
                      </Row>
                    );
                  }}
                />
              </TabPane>
              <TabPane tab="Friends" key="IsProfileFriendsTab">
                <Route
                  path="/profile/IsProfileFriendsTab"
                  render={() => {
                    return (
                      <Row gutter={16}>
                        {/* <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                    </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <FriendRequests
                            isDataRefreshed={(refresh) =>
                              this.isDataRefreshed(refresh)
                            }
                          />
                          <Friends
                            onRef={(friends) => (this.friends = friends)}
                          />
                        </Col>
                      </Row>
                    );
                  }}
                />
              </TabPane>
              <TabPane tab="Groups" className="m-0" key="IsProfileGroupsTab">
                <Route
                  path="/profile/IsProfileGroupsTab"
                  render={() => {
                    return (
                      <Row gutter={16}>
                        {/* <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                    </Col> */}
                        <Col span={24}>
                          <Tabs defaultActiveKey="1"
                            className="group-tabs sub-tab profile-tabs">
                            <TabPane tab="My Groups" key="1">
                              <GroupsPage onRef={(courses) => (this.courses = courses)} />
                            </TabPane>
                            <TabPane tab="Invite Groups" key="2">
                              <Invite displayas={"Card"} />
                            </TabPane>
                            <TabPane tab="Suggested Groups" key="3">
                              <Groups displayas={"Card"} />
                            </TabPane>
                          </Tabs>
                        </Col>
                      </Row>
                    );
                  }}
                />
              </TabPane>
              <TabPane tab="Contests" className="m-0" key="IsProfileContestTab">
                <Route
                  path="/profile/IsProfileContestTab"
                  render={() => {
                    return (
                      <Row gutter={16}>
                        <Col span={24}>
                          <Tabs defaultActiveKey="1"
                            className="group-tabs sub-tab profile-tabs">
                            <TabPane tab="My Contests" key="1">
                              <ContestsPage onRef={(courses) => (this.courses = courses)} />
                            </TabPane>
                          </Tabs>
                        </Col>
                      </Row>
                    );
                  }}
                />
              </TabPane>
              <TabPane tab="Notifications" className="m-0" key="IsProfileNotificationsTab">
                <Row gutter={16}>
                  <Col span={24}>
                    <Notifications />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
          <Col xs={24} sm={24} md={8} lg={7} xl={7}>
            {/* <FriendsSuggestioncard /> */}
            <Groups />
            <div className="affix-top">
              <Ads />
            </div>
          </Col>
        </Row>
        <CommonModal
          className="creategroup-popup"
          visible={isModal}
          title="Create Contest"
          cancel={() => { this.setState({ ...this.state, isModal: false }) }}
          saved={this.saveContest}
        >
          {isModal && (
            <CreateContest
              Type={"Add"}
              handleCancel={() => { this.setState({ ...this.state, isModal: false }) }}
              onRef={(contest) => this.setState({ ...this.state, contest: contest })}
            />
          )}
        </CommonModal>
      </div>
    );
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Profile));
