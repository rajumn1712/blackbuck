import { Col, Row } from "antd";
import React, { Component } from "react";
import Loader from "../common/loader";
import About from "../components/ProfileComponents/about";
import Courses from "../components/ProfileComponents/courses";
import Education from "../components/ProfileComponents/education";
import Hobbies from "../components/ProfileComponents/hobbies";
import Interests from "../components/ProfileComponents/interests";
import Intership from "../components/ProfileComponents/internships";
import VideoProfile from "../components/ProfileComponents/videoprofile";
import { profileDetail } from "../shared/api/apiServer";

class ProfileDetail extends Component {
  state = {
    profileData: {},
    loading: false,
  };

  componentDidMount() {
    this.profielDetails();
  }
  profielDetails = () => {
    this.setState({ ...this.state, loading: true });
    profileDetail(this.props?.id).then((res) => {
      const profiledata = res.data[0].User;
      this.setState({
        profileData: profiledata,
        loading: false,
      });
    });
  };
  render() {
    const { profileData, loading } = this.state;
    return (
      <>
        {loading && <Loader className="loader-top-middle" />}
        {Object.keys(profileData).length > 0 && (
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
                <About
                  about={profileData}
                  callback={(reload) => (reload ? this.profielDetails() : null)}
                />
              </div>
              <div>
                <Interests interests={profileData.Interests} />
              </div>
              <div>
                <Hobbies
                  hobbies={profileData.Hobbies}
                  userid={this.props?.profile?.Id}
                  callback={(reload) => (reload ? this.profielDetails() : null)}
                />
              </div>
              <div>
                <Intership
                  internships={profileData.Internships}
                  userid={this.props?.profile?.Id}
                  callback={(reload) => (reload ? this.profielDetails() : null)}
                />
              </div>
              <div>
                {
                  <VideoProfile
                    video={profileData.VideoAsProfile}
                    userid={this.props?.profile?.Id}
                    callback={(reload) =>
                      reload ? this.profielDetails() : null
                    }
                  />
                }
              </div>
              <div>
                <Education
                  education={profileData.Education}
                  userid={this.props?.profile?.Id}
                  callback={(reload) => (reload ? this.profielDetails() : null)}
                />
              </div>
              <div>
                <Courses loadUserCourse={true} />
              </div>
            </Col>
          </Row>
        )}
      </>
    );
  }
}

export default ProfileDetail;
