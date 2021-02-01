import { Col, Row } from "antd";
import React, { Component } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import Loader from "../common/loader";
import About from "../components/ProfileComponents/about";
import ChangePassword from "../components/ProfileComponents/changepassword";
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
    if (this.props.onRef)
      this.props.onRef(this);
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
      this.props.profile.Interests = profiledata.Interest?profiledata.Interest:0;
      this.props.profile.Internships = profiledata.Internships.length;
      this.props.profile.Groups = profiledata.Groups ? profiledata.Groups : 0;
      this.props.profile.Posts = profiledata.Posts ? profiledata.Posts : 0;
      this.props.profile.BranchName = profiledata.College ? (profiledata.College.BranchName ? profiledata.College.BranchName : "") : "";
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
                {/* <div>
                    <ChangePassword />
                </div> */}
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
