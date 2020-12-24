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
import Postings from "../shared/postings";
import { connect } from "react-redux";
import { saveProfileImage } from "../shared/api/apiServer";
import defaultUser from "../styles/images/defaultuser.jpg";
// import defaultCover from "../styles/images/defaultcover.png";
import ImgCrop from "antd-img-crop";
import { profileSuccess } from "../reducers/auth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { store } from "../store";
import ProfileDetail from "./profileDetail";
import Loader from "../common/loader";
import notify from "../shared/components/notification";
import { apiClient } from '../shared/api/clients';
import Notifications from '../components/notification'
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
          `${this.state.isProfilePic ? "profile_" : "cover_"}${
            this.props?.profile?.Id
          }`
      );
      apiClient
        .post(process.env.REACT_APP_AUTHORITY + "/Home/UploadFile", formData)
        .then((res) => {
          if(res.ok){
            this.imageObject.ImageUrl = res.data[0];
            this.handleImageOk();
          }
          else{
            notify({
              message:"Error",
              description:'Something went wrong',
              type:'error'
            })
          }
        });
    },
    // action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
    // onChange: ({ file }) => {
    //   const { status } = file;
    //   if (status !== "uploading") {
    //     this.imageObject.ImageUrl = file.response[0];
    //     this.handleImageOk();
    //   }
    //   if (status === "done") {
    //     // notify({
    //     //   description: `${this.state.isProfilePic ? "Profil picture" : "Cover picture"
    //     //     } uploaded successfully.`,
    //     //   message: "Upload",
    //     // });
    //   } else if (status === "error") {
    //     message.error(`File upload failed.`);
    //   }
    // },
  };

  handleDisabledChange = (disabled) => {
    this.setState({ disabled });
  };

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
            description: `${this.state.isProfilePic ? "Profil picture" : "Cover picture"
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
  ExportPdf = () => {
    const doc = new jsPDF();
    const html = `
          <table style={{borderWidth: 1;borderColor: '#f9f9f9'}}>
            <thead>
              <tr>
                <th style={{backgroundColor: '#f9f9f9', padding: 8}}>SERVICE</th>
                <th style={{backgroundColor: '#f9f9f9', padding: 8}}>DESCRIPTION</th>
                <th style={{backgroundColor: '#f9f9f9', padding: 8}}>PRICE</th>
                <th style={{backgroundColor: '#f9f9f9', padding: 8}}>QTY</th>
                <th style={{backgroundColor: '#f9f9f9', padding: 8}}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Design</td>
                <td>Creating a recognizable design solution based on the company's existing visual identity</td>
                <td>$40.00</td>
                <td>26</td>
                <td>$1,040.00</td>
              </tr>
              <tr>
                <td>Development</td>
                <td>Developing a Content Management System-based Website</td>
                <td>$40.00</td>
                <td>80</td>
                <td>$3,200.00</td>
              </tr>
              <tr>
                <td>SEO</td>
                <td>Optimize the site for search engines (SEO)</td>
                <td>$40.00</td>
                <td>20</td>
                <td>$800.00</td>
              </tr>
              <tr>
                <td>Training</td>
                <td>Initial training sessions for staff responsible for uploading web content</td>
                <td>$40.00</td>
                <td>4</td>
                <td>$160.00</td>
              </tr>
              <tr>
                <td>SUBTOTAL</td>
                <td>$5,200.00</td>
              </tr>
              <tr>
                <td>TAX 25%</td>
                <td>$1,300.00</td>
              </tr>
              <tr>
                <td colspan="4">GRAND TOTAL</td>
                <td>$6,500.00</td>
              </tr>
            </tbody>
          </table>
        `
    doc.html(html).then(() => {
      doc.save("test.pdf")
    });

    // this.setState({ ...this.state, loading: true });
    // const input = document.getElementById("downloadpdf");
    // html2canvas(input, {
    //   onclone: function (clonedDoc) {
    //     clonedDoc.getElementById("downloadpdf").style.visibility = "visible";
    //   },
    // }).then((canvas) => {
    //   this.setState({ ...this.state, loading: false });
    //   const imgData = canvas.toDataURL("image/png", "1.0");
    //   const pdf = new jsPDF("p", "in", "a4");
    //   pdf.addImage(imgData, "JPEG", 0, 0, 0, 0);
    //   pdf.save("download.pdf");
    // });
  };

  render() {
    const { isDataRefresh, profile, tabkey, imageLoader } = this.state;
    // if (this.state.loading) {
    //   return <Loader className="loader-top-middle" />;
    // }
    const operations = (
      <Button className="profile-download" onClick={this.ExportPdf}>
        <span className="post-icons download-icon"></span>Download Profile
      </Button>
    );
    return (
      <div className="main">
        <Row gutter={16}>
          <Col xs={24} sm={16} md={17} lg={17} xl={17}>
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
                <Upload {...this.uploadProps}>
                  <Tooltip title="Change Coverphoto">
                    <a
                      className="editpost"
                      onClick={() => this.setState({ isProfilePic: false })}
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
                  className="afterline"
                  value={profile?.Friends ? profile.Friends : 0}
                />
                <Statistic
                  className="afterline"
                  title="Groups"
                  value={profile?.Groups ? profile.Groups : 0}
                />
                <Statistic
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
                        <Upload {...this.uploadProps}>
                          {imageLoader && <Loader className="loader-top-middle" />}
                          <Avatar src={profile?.ProfilePic || defaultUser} />
                          <Tooltip placement="top" title="Change Photo">
                            <a
                              className="img-camera"
                              onClick={() =>
                                this.setState({ isProfilePic: true })
                              }
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
                  className="afterline"
                  value={profile?.Shares ? profile?.Shares : 0}
                />
                <Statistic
                  title="Interests"
                  className="afterline"
                  value={profile?.Interests ? profile?.Interests : 0}
                />
                <Statistic title="Internships" value={profile?.Internships ? profile?.Internships : 0} />
              </div>
            </div>
            <Tabs
              defaultActiveKey={tabkey}
              className="profile-tabs"
              tabBarExtraContent={operations}
              onChange={this.handleTabChange}
            >
                        <TabPane tab="Profile" key="1">
                <Route
                  path="/profile/1"
                  render={() => {
                    return (
                      <div>
                        {this.state.loading && (
                          <Loader className="loader-top-middle" />
                        )}
                        <ProfileDetail id={this.props?.profile?.Id} />
                      </div>
                    );
                  }}
                />
              </TabPane>
              <TabPane tab="Posts" key="2">
                <Route
                  path="/profile/2"
                  render={() => {
                    return (
                      <Row gutter={16}>
                        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                          <Invite />
                          <Courses />
                        </Col>
                        <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                          <Postings postingsType="user" sharebox={true} />
                        </Col>
                      </Row>
                    );
                  }}
                />
              </TabPane>
              <TabPane tab="Friends" key="3">
                <Route
                  path="/profile/3"
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
              <TabPane tab="Groups" className="m-0" key="4">
                <Route
                  path="/profile/4"
                  render={() => {
                    return (
                      <Row gutter={16}>
                        {/* <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                    </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <GroupsPage />
                        </Col>
                      </Row>
                    );
                  }}
                />
              </TabPane>
              <TabPane tab="Notifications" className="m-0" key="5">
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Notifications />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
          <Col xs={24} sm={8} md={7} lg={7} xl={7}>
            {/* <FriendsSuggestioncard /> */}
            <Groups />
            <Affix offsetTop={86}>
              <Ads />
            </Affix>
          </Col>
        </Row>
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
