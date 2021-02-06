import React, { Component } from "react";
import { Card, Avatar, List, Row, Col, Tabs, Dropdown, Menu } from "antd";
import { store } from "../store";
import "../index.css";
import "../App.css";
import { fetchUserFriends } from "../shared/api/apiServer";
import defaultUser from "../styles/images/defaultuser.jpg";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../common/loader";
import { unFriend } from '../shared/api/apiServer'
import notify from "../shared/components/notification";
import { profileSuccess } from "../reducers/auth";
class Friends extends Component {
  componentDidMount() {

    if (this.props.onRef)
      this.props.onRef(this);
    this.getFriends();
  }
  getFriends() {
    this.setState({ ...this.state, loading: true });
    fetchUserFriends(
      this.props.userId ? this.props.userId : this.props?.profile?.Id
    ).then((res) => {
      const friendsInfo = res.data;
      this.setState({ FriendsList: friendsInfo, loading: false });
    });
  }
  state = {
    FriendsList: [],
    loading: false,
  };
  render() {
    const { user } = store.getState().oidc;
    const { FriendsList, loading } = this.state;
    return (
      <div className="custom-card requests">
        {loading && <Loader className="loader-top-middle" />}

        {/*    /// FRIENDS TABS ///   
        <div className="main">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div >
            <Tabs defaultActiveKey="1"
              className="group-tabs sub-tab profile-tabs"
              onChange={(e) => this.setState({ ...this.state, tabkey: e })}>
              <TabPane className="group-page" tab="Friends" key="1">
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <List
            grid={{
              column: 2,
              xs: 1,
              md: 2,
            }}
            itemLayout="horizontal"
            dataSource={FriendsList}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Link to="/commingsoon">
                      <Avatar
                        className="request-image"
                        src={item.Image || defaultUser}
                      />
                    </Link>
                  }
                  title={
                    <div className="d-flex align-items-center">
                      <Link to={"/profileview/" + item.UserId}>
                        <span className="overflow-text post-title">
                          {item.Firstname}
                        </span>
                      </Link>
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
                          {item.MutualFriends?.map((friend, index) => {
                            return (
                              <Avatar
                                key={index}
                                src={friend.Image || defaultUser}
                              />
                            );
                          })}
                        </Avatar.Group>
                      </span>
                      {item.MutualFriends.length > 0 && (
                        <span>
                          <span>{item.MutualFriends.length}</span>
                          <span> Mutual Friends</span>
                        </span>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Invite Friends" key="3">
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                 
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Suggested Friends" key="2">
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
            </div>
          </Col>
        </Row>
      </div>  /// FRIENDS TABS /// */}

        <Card title={`Friends (${FriendsList.length})`} bordered={true}>
          <List
            grid={{
              column: 2,
              xs: 1,
              md: 2,
            }}
            itemLayout="horizontal"
            dataSource={FriendsList}
            renderItem={(item) => (
              <List.Item style={{display: 'flex', alignItems: 'center'}}>
                <List.Item.Meta
                  avatar={
                    <Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId}>
                      <Avatar
                        className="request-image"
                        src={item.Image || defaultUser}
                      />
                    </Link>
                  }
                  title={
                    <div className="d-flex align-items-center">
                      <Link to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId}>
                        <span className="overflow-text post-title">
                          <Link className="overflow-text post-title" to={this.props.profile.Id === item.UserId ? "/profile/IsProfileTab" : "/profileview/" + item.UserId}> {item.Firstname}</Link>
                        </span>
                      </Link>
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
                          {item.MutualFriends?.map((friend, index) => {
                            return (
                              <Link to={this.props.profile.Id === friend.UserId ? "/profile/IsProfileTab" : "/profileview/" + friend.UserId}>   <Avatar
                                key={index}
                                src={friend.Image || defaultUser}
                              />
                              </Link>
                            );
                          })}
                        </Avatar.Group>
                      </span>
                      {item.MutualFriends.length > 0 && (
                        <span>
                          <span>{item.MutualFriends.length}</span>
                          <span> Mutual Friends</span>
                        </span>
                      )}
                     
                    </div>
                  }
                />
                
                {!this.props.userId && <Dropdown overlay={<Menu className="custom-dropdown">
                  <Menu.Item key="0" onClick={async () => {
                    const unRes = await unFriend(this.props.profile?.Id, item.UserId);
                    if (unRes.ok) {
                      let frnds = [...this.state.FriendsList];
                      frnds = frnds.filter(frnd => frnd.UserId !== item.UserId);
                      this.props.profile.Friends = this.props.profile.Friends ? (this.props.profile.Friends > 0 ? (this.props.profile.Friends - 1) : 0) : 0;
                      this.props.updateProfile(this.props.profile);
                      this.setState({ ...this.state, FriendsList: frnds })
                    } else {
                      notify({ type: "error", message: "Error", description: "Somethings went wrong. Please try again later" })
                    }
                  }}>
                    <a style={{ cursor: "pointer" }}>Un-friend</a>
                  </Menu.Item>
                </Menu>} trigger={['click']} placement="bottomRight">
                  <a className="ant-dropdown-link ml-auto" onClick={e => e.preventDefault()}>
                    <span className="icons more mr-0"></span>
                  </a>
                </Dropdown>
                }
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
export default connect(mapStateToProps, mapDispatchToProps)(Friends);
