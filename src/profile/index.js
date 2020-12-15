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
import defaultCover from "../styles/images/defaultcover.png";
import ImgCrop from "antd-img-crop";
import { profileSuccess } from "../reducers/auth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { store } from "../store";
import ProfileDetail from "./profileDetail";
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
    // loading: true,
    profile: this.props?.profile,
    tabkey: this.props?.match.params.tabkey,
    showDownload: false,
  };
  isDataRefreshed = (refresh) => {
    this.setState({ ...this.state, isDataRefresh: refresh });
  };
  uploadProps = {
    name: "file",
    multiple: false,
    fileList: [],
    action: "http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile",
    onChange: ({ file }) => {
      const { status } = file;
      if (status !== "uploading") {
        this.imageObject.ImageUrl = file.response[0];
        this.handleImageOk();
      }
      if (status === "done") {
        message.success(
          `${
            this.state.isProfilePic ? "Profil picture" : "Cover picture"
          } uploaded successfully.`
        );
      } else if (status === "error") {
        message.error(`File upload failed.`);
      }
    },
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
        this.profielDetails();
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
    const input = document.getElementById("downloadpdf");
    html2canvas(input, {
      onclone: function (clonedDoc) {
        clonedDoc.getElementById("downloadpdf").style.visibility = "visible";
      },
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "in", "a4");
      pdf.addImage(imgData, "JPEG", 0, 0, 0 ,0);
      pdf.save("download.pdf");
    });
  };
  renderHtmlPdf = () => {
    return (
      <div
        id="downloadpdf"
        ref={(r) => (this.downloadpdf = r)}
        style={{ visibility: "hidden", height: 0 }}
      >
        <Row className="downloadprofile">
          <Col span={9} className="dwnpleft">
            <div className="contact-information">
              <h3>Contact</h3>
              <p>7799036981</p>
              <p>vishnu@zirafftechnologies.com</p>
              <p>
                01-11-65/1,Street Number 2,Road No 5, Colony
                ,visakhapatnam,Andhra Pradesh,India,500036
              </p>
              <p style={{ wordBreak: "break-all" }}>
                http://localhost:3000/profile/vishnutrimurthulu
              </p>
            </div>
            <div className="certificate-info">
              <h3>Certifications</h3>
              <p>AMCAT Certified Software Engineer - IT Services</p>
              <p>HARDWARE AND NETWRKING,CCNA,MCSA,RHEL</p>
            </div>
            <div className="hobbies-info">
              <h3>Hobbies</h3>
              <ul>
                <li>Cricket</li>
                <li>Music</li>
                <li>Dance</li>
              </ul>
            </div>
          </Col>
          <Col span={15} className="dwnrleft">
            <div className="primary-info">
              <h1>VISHNU TRIMURTHULU PALLIVELA</h1>
              <p>Hyderbad</p>
            </div>
            <div className="about-info">
              <h3>About me</h3>
              <p>
                Your About Me page should convey: Who you are and what you’re
                doing How you got there Where you’re looking to go next Use it
                to describe your credentials, expertise, and goals. What’s the
                best way to start? The following exercises can be helpful in
                figuring all of that out, and will help you determine what to
                include based on your target audience.
              </p>
            </div>
            <div className="academy-info">
              <h3>Education</h3>
              <h4>Blackbuck Educational Society Group of Institutions</h4>
              <p>
                Bachelor of Technology - BTech, Electronics and Communications
                Engineering · (2012 - 2016)
              </p>
              <h4>Narayana Junior College</h4>
              <p>BOI, maths,physics,chemistry · (2010 - 2012)</p>
              <h4>Krishna Public School</h4>
              <p>SSC, 10th · (2009 - 2010)</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { isDataRefresh, profile, tabkey } = this.state;
    // if (this.state.loading) {
    //   return <Loader className="loader-middle" />;
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
              <span className="premium-badge">
                <img src={PremiumBadge} />
              </span>
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
                  value={profile?.Shares}
                />
                <Statistic
                  title="Interests"
                  className="afterline"
                  value={profile?.Interests}
                />
                <Statistic title="Internships" value={profile?.Internships} />
              </div>
            </div>
            <Tabs
              defaultActiveKey={tabkey}
              className="profile-tabs"
              tabBarExtraContent={operations}
              onChange={this.handleTabChange}
            >
              <TabPane tab="Posts" key="1">
                <Route
                  path="/profile/1"
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
              <TabPane tab="Profile" key="2">
                <Route
                  path="/profile/2"
                  render={() => {
                    return (
                      <div id="divToPrint">
                        <ProfileDetail id={this.props?.profile?.Id} />
                      </div>
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
                          <Friends isDataRefreshed={isDataRefresh} />
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
        <div
          id="downloadpdf"
          ref={(r) => (this.downloadpdf = r)}
          style={{ visibility: "hidden", height: 0 }}
        >
          <Row className="downloadprofile">
            <Col span={8} className="dwnpleft">
              <div className="contact-information">
                <h3>Contact</h3>
                <p>7799036981</p>
                <p>vishnu@zirafftechnologies.com</p>
                <p>
                  01-11-65/1,Street Number 2,Road No 5 , Colony
                  ,visakhapatnam,Andhra Pradesh,India,500036
                </p>
                <p style={{ wordBreak: "break-all" }}>
                  http://localhost:3000/profile/vishnutrimurthulu
                </p>
              </div>
              <div className="certificate-info">
                <h3>Certifications</h3>
                <p>AMCAT Certified Software Engineer - IT Services</p>
                <p>HARDWARE AND NETWRKING,CCNA,MCSA,RHEL</p>
              </div>
              <div className="hobbies-info">
                <h3>Hobbies</h3>
                <ul>
                  <li>Cricket</li>
                  <li>Music</li>
                  <li>Dance</li>
                </ul>
              </div>
            </Col>
            <Col span={16} className="dwnrleft">
              <div className="primary-info">
                <h1>VISHNU TRIMURTHULU PALLIVELA</h1>
                <p>Hyderbad</p>
              </div>
              <div className="about-info">
                <h3>About me</h3>
                <p>
                  Your About Me page should convey: Who you are and what you’re
                  doing How you got there Where you’re looking to go next Use it
                  to describe your credentials, expertise, and goals. What’s the
                  best way to start? The following exercises can be helpful in
                  figuring all of that out, and will help you determine what to
                  include based on your target audience.
                </p>
              </div>
              <div className="academy-info">
                <h3>Education</h3>
                <h4>Blackbuck Educational Society Group of Institutions</h4>
                <p>
                  Bachelor of Technology - BTech, Electronics and Communications
                  Engineering · (2012 - 2016)
                </p>
                <h4>Narayana Junior College</h4>
                <p>BOI, maths,physics,chemistry · (2010 - 2012)</p>
                <h4>Krishna Public School</h4>
                <p>SSC, 10th · (2009 - 2010)</p>
              </div>
            </Col>
          </Row>
        </div>
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
