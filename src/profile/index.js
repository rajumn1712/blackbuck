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
import Notifications from '../components/notification';
import Moment from "react-moment";
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
    // const doc = new jsPDF();
    const profileData = this.getDetails.state.profileData;
    const html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">     
    <link href="http://fonts.cdnfonts.com/css/neue-haas-grotesk-text-pro" rel="stylesheet">       
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Profile</title>
    <style>
         @import url('http://fonts.cdnfonts.com/css/neue-haas-grotesk-text-pro');
        * {
            font-family: 'Neue Haas Grotesk Text Pro', sans-serif;
        }
       
    </style>
</head>

<body style="margin: 0;width: 794px;">
    <table style="width: 794px;background-color: #07A3B2;margin: auto;border-collapse: collapse;">
        <tr>
            <td style="width: 30%;padding: 60px 24px 24px;vertical-align: top;">
                <table style="border-collapse: collapse;width: 100%;">
                    <tr style="margin-bottom: 24px;">
                        <td>
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-top: 0;margin-bottom: 0.5em;">Contact</h3>
                            <p style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">${profileData.PhoneNumber}</p>
                            <p style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">${profileData.Email}</p>
                            ${profileData.Address.map((displayaddress, index) => {
                              delete displayaddress.AddressId;
                              return (
                                <p key={index} style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">
                                  {Object.keys(displayaddress)
                                    .map((k) => {
                                      return displayaddress[k];
                                    })
                                    .join(",")}
                                </p>
                              );
                            })}
                            
                            <p style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;word-break: break-all;">http://localhost:3000/profile/vishnutrimurthulu</p> 
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-bottom: 0.5em;">Certifications</h3>
                            ${profileData.Internships.map((internship, index) => {
                              return (
                                <p key={index} style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">
                                  {internship.CompanyName}-{internship.Duration}
                                </p>
                              )})};
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <h3  style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-bottom: 0.5em;">Hobbies</h3>
                            <ul style="list-style-type: none;padding-left: 0;">
                            ${profileData.Hobbies.map((hobbie, index) => {
                              return <li key={index} style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">{hobbie}</li>;
                            })}
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="background-color: #ffffff;width: 70%;padding: 60px 24px 24px;vertical-align: top;">
                <table style="border-collapse: collapse; width:100%;">
                    <tr>
                        <td >
                            <h1 style="margin-top:0;font-weight: 400;font-size: 36px;color:#000000b3;margin-bottom: 5px;line-height: 40px;text-transform: capitalize;">${profileData.Firstname} ${profileData.Lastname}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#000000b3;margin-bottom: 0.5em;">About me</h3>
                            <p style="margin-bottom: 6px;margin-top: 0;line-height: 1.5715;font-size: 14px;margin-bottom: 6px !important;color: #00000080;text-align: justify;">${profileData?.Aboutme}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#000000b3;margin-bottom: 0.5em;">Education</h3>
                            <table>
                            ${profileData.Education.map((education, index) => {
                              return (
                                <tr key={index}>
                                    <td>
                                        <h4 style="font-size: 18px;font-weight: 400;line-height: 22px;margin-top: 0; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85);">{education.Name}</h4>
                                        <p style="margin-bottom: 6px;margin-top: 0;line-height: 1.5715;font-size: 14px;margin-bottom: 6px !important;color: #00000080;">{education.Degree}</p>
                                        <p style="margin-bottom: 6px;margin-top: 0;line-height: 1.5715;font-size: 14px;margin-bottom: 6px !important;color: #00000080;"><Moment format="YYYY">{education.StartDate}</Moment>
                                        {"-"}
                                        <Moment format="YYYY">{education.EndDate}</Moment></p>
                                    </td>
                                </tr>
                              );
                            })}
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
        `;
    // doc.html(html).then(() => {
    //   doc.save("test.pdf")
    // });
console.log(html)
    apiClient.post(process.env.REACT_APP_AUTHORITY + '/Account/DownLoadProfile',{
      FileName:this.props?.profile?.FirstName,
      TemplateContent:html
    }).then(res=>{
      window.open(res.data);
    })

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
                        <ProfileDetail id={this.props?.profile?.Id} onRef={(profiledetails)=>this.getDetails=profiledetails}/>
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
                          <Tabs defaultActiveKey="1"
                            className="group-tabs sub-tab profile-tabs">
                            <TabPane tab="My Groups" key="1">
                              <Row gutter={16}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                  <GroupsPage onRef={(courses) => (this.courses = courses)} />
                                </Col>
                              </Row>
                            </TabPane>
                            <TabPane tab="Invite Groups" key="2">
                              <Row gutter={16}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                  <Invite displayas={"Card"} />
                                </Col>
                              </Row>
                            </TabPane>
                            <TabPane tab="Suggested Groups" key="3">
                              <Row gutter={16}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                  <Groups displayas={"Card"} />
                                </Col>
                              </Row>
                            </TabPane>
                          </Tabs>
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
