import React, { Component } from "react";
import { Card, Avatar, List } from "antd";
import { store } from "../store";
import "../index.css";
import "../App.css";
import { fetchUserFriends } from "../shared/api/apiServer";
import defaultUser from "../styles/images/defaultuser.jpg";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../common/loader";
class Friends extends Component {
  componentDidMount() {
    this.getFriends();
  }
  componentDidUpdate() {
    if (this.props.isDataRefreshed) {
      this.getFriends();
    }
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
        <Card title={`Friend (${FriendsList.length})`} bordered={true}>
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
        </Card>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
export default connect(mapStateToProps)(Friends);
