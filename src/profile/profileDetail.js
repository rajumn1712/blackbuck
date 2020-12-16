import { Col, Row } from "antd";
import React, { Component } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import Loader from "../common/loader";
import About from "../components/ProfileComponents/about";
import Courses from "../components/ProfileComponents/courses";
import Education from "../components/ProfileComponents/education";
import Hobbies from "../components/ProfileComponents/hobbies";
import Interests from "../components/ProfileComponents/interests";
import Intership from "../components/ProfileComponents/internships";
import VideoProfile from "../components/ProfileComponents/videoprofile";
import { profileSuccess } from "../reducers/auth";
import { profileDetail } from "../shared/api/apiServer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { store } from '../store';

class ProfileDetail extends Component {
  state = {
    profileData: {},
    loading: false,
    isDataRefresh: false,
  };

  componentDidMount() {
    this.profielDetails();
    this.storeSubscription = store.subscribe(() => {
      const { profile } = store.getState().oidc;
      this.setState({ ...this.state, profile });
    });
  }
  componentWillUnmount() {
    this.storeSubscription();
  }
  profielDetails = () => {
    this.setState({ ...this.state, loading: true, isDataRefresh: false });
    profileDetail(this.props?.id).then((res) => {
      let profiledata = res.data[0].User;
      this.props.profile.Interests = profiledata.Interest;
      this.props.profile.Internships = profiledata.Internships.length;
      this.props.updateProfile(this.props.profile);
      this.setState({
        ...this.state,
        profileData: profiledata,
        loading: false,
        isDataRefresh: true,
      });
    });
  };
  render() {
    const { profileData, loading, isDataRefresh } = this.state;
    return (
      <>
        {loading && <Loader className="loader-top-middle" />}
        {Object.keys(profileData).length > 0 && (
          <>
            <div
              id="downloadpdf"
              ref={(r) => (this.downloadpdf = r)}
              style={{ visibility: "hidden", height: 0 }}
            >
              <Row className="downloadprofile">
                <Col span={8} className="dwnpleft">
                  <div className="contact-information">
                    <h3>Contact</h3>
                    <p>{profileData?.PhoneNumber}</p>
                    <p>{profileData?.Email}</p>

                    {profileData?.Address?.map((displayaddress, index) => {
                      delete displayaddress.AddressId;
                      return (
                        <p key={index}>
                          {Object.keys(displayaddress)
                            .map((k) => {
                              return displayaddress[k];
                            })
                            .join(",")}
                        </p>
                      );
                    })}

                    {/* <p style={{ wordBreak: "break-all" }}>
                      http://localhost:3000/profile/vishnutrimurthulu
                    </p> */}
                  </div>
                  <div className="certificate-info">
                    <h3>Certifications</h3>
                    {profileData.Internships?.map((internship, index) => {
                      return (
                        <p>
                          {internship.CompanyName}-{internship.Duration}
                        </p>
                      );
                    })}
                  </div>
                  <div className="hobbies-info">
                    <h3>Hobbies</h3>
                    <ul>
                      {profileData?.Hobbies?.split(",").map((hobbie, index) => {
                        return <li key={index}>{hobbie}</li>;
                      })}
                    </ul>
                  </div>
                </Col>
                <Col span={16} className="dwnrleft">
                  <div className="primary-info">
                    <h1>
                      {profileData?.Firstname} {profileData?.Lastname}
                    </h1>
                    {/* <p>profileData?.Location</p> */}
                  </div>
                  <div className="about-info">
                    <h3>About me</h3>
                    <p>{profileData?.AboutMe}</p>
                  </div>
                  <div className="academy-info">
                    <h3>Education</h3>
                    {profileData?.Education?.map((education, index) => {
                      return (
                        <div>
                          <h4>{education.Name}</h4>
                          <p>
                            <Moment format="YYYY">{education.StartDate}</Moment>
                            {"-"}
                            <Moment format="YYYY">{education.EndDate}</Moment>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </div>
            <Row gutter={16}>
              {/* <Col xs={24} sm={8} md={8} lg={8} xl={8} className="profile-tab">
                                        <div className="left-rail">
                                            <Menu className="menu-items profile-menu" mode="vertical" title="Blackbuck">
                                                {navigations.map(navigatieItem => {
                                                    return <Menu.Item key={navigatieItem.Id}><Link onClick={() => this.handleDomNavigate(this.references[navigatieItem.Id])}><span className={navigatieItem.CssSprite}></span><span>{navigatieItem.Heading}</span></Link></Menu.Item>
                                                })}
                                            </Menu>
                                        </div>
                                        <Invite />
                                        <Tags />
                                    </Col> */}
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div>
                  {isDataRefresh && (
                    <About
                      about={profileData}
                      callback={(reload) =>
                        reload ? this.profielDetails() : null
                      }
                    />
                  )}
                </div>
                <div>
                  {isDataRefresh && (
                    <Interests
                      interests={profileData.Interests}
                      callback={(reload) =>
                        reload ? this.profielDetails() : null
                      }
                    />
                  )}
                </div>
                <div>
                  {isDataRefresh && (
                    <Hobbies
                      hobbies={profileData.Hobbies}
                      userid={this.props?.profile?.Id}
                      callback={(reload) =>
                        reload ? this.profielDetails() : null
                      }
                    />
                  )}
                </div>
                <div>
                  {isDataRefresh && (
                    <Intership
                      internships={profileData.Internships}
                      userid={this.props?.profile?.Id}
                      callback={(reload) =>
                        reload ? this.profielDetails() : null
                      }
                    />
                  )}
                </div>
                <div>
                  {isDataRefresh && (
                    <VideoProfile
                      video={profileData.VideoAsProfile}
                      userid={this.props?.profile?.Id}
                      callback={(reload) =>
                        reload ? this.profielDetails() : null
                      }
                    />
                  )}
                </div>
                <div>
                  {isDataRefresh && (
                    <Education
                      education={profileData.Education}
                      userid={this.props?.profile?.Id}
                      callback={(reload) =>
                        reload ? this.profielDetails() : null
                      }
                    />
                  )}
                </div>
                <div>
                  <Courses loadUserCourse={true} />
                </div>
              </Col>
            </Row>
          </>
        )}
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetail);
