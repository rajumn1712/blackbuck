import React, { Component } from "react";
import { Card, Avatar, List, message } from "antd";
import { Link } from "react-router-dom";
// import { userManager } from '../shared/authentication/auth';
import { store } from "../../store";
import User1 from "../../styles/images/avatar.png";
import User2 from "../../styles/images/user.jpg";
import User3 from "../../styles/images/user_image.jpg";
import User4 from "../../styles/images/user-image.jpg";
// import user from '../styles/images/user.jpg';
// import { userLogout } from '../reducers/auth';
import "../../index.css";
import "../../App.css";
import notify from "../../shared/components/notification";
import {
  acceptFrienRequest,
  fetchFriendRequests,
} from "../../shared/api/apiServer";
import defaultUser from "../../styles/images/defaultuser.jpg";
import connectStateProps from "../../shared/stateConnect";
import { profileSuccess } from "../../reducers/auth";
import { connect } from "react-redux";
import Loader from "../../common/loader";

class FriendRequests extends Component {
  state = {
    friendRequests: [],
    loading: false,
  };
  componentDidMount() {
    this.loadRequests();
  }
  async loadRequests(isDataRefreshed) {
    this.setState({ ...this.state, loading: true });
    const requests = await fetchFriendRequests(this.props.profile?.Id);
    if (requests.ok) {
      this.setState({ friendRequests: requests.data, loading: false });
      if (isDataRefreshed) {
        this.props.isDataRefreshed(isDataRefreshed);
        this.props.isDataRefreshed(false);
      }
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
      CreatedDate:new Date(),
    };
    acceptFrienRequest(
      this.props.profile?.Id,
      friend.UserId,
      "accept",
      obj
    ).then(() => {
      message.success("Action Success");
      this.loadRequests(true);
      this.props.profile.Friends = this.props.profile.Friends
        ? this.props.profile.Friends + 1
        : 1;
      this.props.updateProfile(this.props.profile);
    });
  };

  handleRemove = (friend) => {
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
      friend.UserId,
      "decline",
      obj
    ).then(() => {
      message.success("Action Success");
      this.loadRequests();
    });
  };

  render() {
    const { user } = store.getState().oidc;
    const data = [...this.state.friendRequests];
    if (!data || data.length === 0) {
      return null;
    }
    return (
      <div className="custom-card requests">
        {this.state.loading && <Loader className="loader-top-middle" />}
        <Card title={`Friend Requests (${data.length})`} bordered={false}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Link to={"/profileview/" + item.UserId}><Avatar
                      className="request-image"
                      src={item.Image || defaultUser}
                    /></Link>
                  }
                  title={
                    <div className="d-flex align-items-center">
                      <span className="overflow-text">
                      <Link className="overflow-text post-title" to={"/profileview/" + item.UserId}>
                        {[item.Firstname, item.Lastname].join(" ")}
                        </Link>
                      </span>
                    </div>
                  }
                  description={
                    <div className="mt-8 d-flex align-items-center">
                      <span className="list-request">
                        <Avatar.Group
                          maxCount={4}
                          size="large"
                          maxStyle={{
                            color: "var(--primary)",
                            backgroundColor: "var(--secondary)",
                          }}
                        >
                          {item?.mutualFriends?.map((member, index) => {
                            return (
                              <Link to={"/profileview/" + member.UserId}><Avatar
                                src={member.Image}
                                key={index}
                                style={{
                                  backgroundColor: member.Image
                                    ? ""
                                    : "#f56a00",
                                }}
                              >
                                {member.Image
                                  ? null
                                  : [
                                      member.Firstname.charAt(0),
                                      member.Lastname.charAt(0),
                                    ].join("")}
                              </Avatar>
                              </Link>
                            );
                          })}
                        </Avatar.Group>
                      </span>{" "}
                      <span style={{ fontWeight: 500 }}>Mutual Friends</span>
                    </div>
                  }
                />
                {!this.props.IsHideAction ? (
                  <Link
                    className="f-14 mr-16 list-link"
                    onClick={() => this.handleAccept(item)}
                  >
                    Accept
                  </Link>
                ) : null}
                {!this.props.IsHideAction ? (
                  <Link
                    className="f-14 ml-16 list-remove"
                    onClick={(index) => this.handleRemove(item)}
                  >
                    Remove
                  </Link>
                ) : null}
              </List.Item>
            )}
          />
        </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(FriendRequests);
