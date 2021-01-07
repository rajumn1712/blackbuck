import React, { Component } from "react";
import { Card, Avatar, Menu, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { profileSuccess } from "../reducers/auth";
import defaultUser from "../styles/images/defaultuser.jpg";
import coverphoto from "../styles/images/default-cover.png";
import { connect } from "react-redux";
import { store } from "../store";
const { Meta } = Card;
const { SubMenu } = Menu;
class Identity extends Component {
  storeSubscription;
  state = {
    profile: this.props?.profile,
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
  render() {
    const { profile: homeInfo } = this.state;
    return (
      <div className="left-rail">
        <Card
          className="profile-card"
          actions={[
            <div className="profile-status f-16">
              {homeInfo?.Friends ? homeInfo?.Friends : 0}
              <span className="f-12">Friends</span>
            </div>,
            <div className="profile-status f-16">
              {homeInfo?.Groups ? homeInfo?.Groups : 0}
              <span className="f-12">Groups</span>
            </div>,
            <div className="profile-status f-16">
              {homeInfo?.Posts ? homeInfo.Posts : 0}
              <span className="f-12">Posts</span>
            </div>,
          ]}
          cover={<img src={homeInfo?.CoverPic || coverphoto} />}
        >
          <Link to="/profile/IsProfileTab">
            <Meta
              avatar={<Avatar src={homeInfo?.ProfilePic || defaultUser} />}
              title={
                <div>
                  {homeInfo?.FirstName} {homeInfo?.LastName}
                  {homeInfo?.IsScholar && <span className="premium-icon c-default"></span>}
                </div>
              }
              description={<Tooltip title={homeInfo?.BranchName} placement={'bottom'}>{homeInfo?.BranchName}</Tooltip>}
            />
          </Link>
          <Link to="/profile/IsProfileTab" className="fullprofilelink">
              View Full Profile
          </Link>
        </Card>
        <Menu
          className="menu-items profile-menu"
          mode="vertical"
          title="Blackbuck"
        >
          <Menu.Item key="profile">
            <Link to="/profile/IsProfileTab">
              <span className="left-menu profile-icon"></span>
              <span>Profile</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="friends">
            <Link to="/profile/IsProfileFriendsTab">
              <span className="left-menu friends-icon"></span>
              <span>Friends</span>
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="newsfeed">
            <Link to="/newsfeed">
              <span className="left-menu post-icon"></span>
              <span>Posts</span>
            </Link>
          </Menu.Item> */}
          <Menu.Item key="groups">
            <Link to="/profile/IsProfileGroupsTab">
              <span className="left-menu group-icon"></span>
              <span>Groups</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="notification">
            <Link to="/profile/IsProfileNotificationsTab">
              <span className="left-menu noti-icon"></span>
              <span>Notifications</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="savedposts">
            <Link to="/savedposts">
              <span className="left-menu savedpost-icon"></span>
              <span>Saved Posts</span>
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { user: oidc.user, profile: oidc.profile };
};
const mapDispatchToProps = (dispatch) => {
  return {
    upadateProfile: (info) => {
      dispatch(profileSuccess(info));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Identity);
